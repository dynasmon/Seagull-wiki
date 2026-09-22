export type Side = 'top' | 'right' | 'bottom' | 'left';
export type NodeKind = 'process' | 'topic' | 'store' | 'actor';
export type FlowEdgeKind = 'data' | 'control' | 'ack';
export type GroupTone = 'neutral' | 'endpoint' | 'operator' | 'backend';
export type LabelSide = 'on' | 'above' | 'below' | 'left' | 'right';

export interface FlowNodeSpec {
  readonly label: string;
  readonly detail?: string;
  readonly kind: NodeKind;
  readonly col: number;
  readonly row: number;
  readonly cols?: number;
  readonly rows?: number;
  readonly planned?: boolean;
}

export interface FlowEdgeSpec<Id extends string> {
  readonly from: Id;
  readonly to: Id;
  readonly label?: string;
  readonly kind?: FlowEdgeKind;
  readonly exit?: Side;
  readonly enter?: Side;
  readonly exitAt?: number;
  readonly enterAt?: number;
  readonly exitCol?: number;
  readonly enterCol?: number;
  readonly exitRow?: number;
  readonly enterRow?: number;
  readonly channel?: number;
  readonly labelAt?: number;
  readonly labelSide?: LabelSide;
}

export type GroupLabelPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface FlowGroupSpec {
  readonly label: string;
  readonly tone?: GroupTone;
  readonly cols: readonly [number, number];
  readonly rows: readonly [number, number];
  readonly labelPosition?: GroupLabelPosition;
}

export interface FlowGridSpec {
  readonly columns: readonly number[];
  readonly rows: number;
  readonly rowHeight?: number;
  readonly columnGap?: number;
  readonly rowGap?: number;
  readonly margin?: number | { readonly x: number; readonly y: number };
}

export type LegendKey = NodeKind | FlowEdgeKind | 'planned';

export interface FlowSpec<Id extends string = string> {
  readonly title: string;
  readonly caption?: string;
  readonly direction?: 'down' | 'right';
  readonly grid: FlowGridSpec;
  readonly nodes: Readonly<Record<Id, FlowNodeSpec>>;
  readonly edges: readonly FlowEdgeSpec<NoInfer<Id>>[];
  readonly groups?: readonly FlowGroupSpec[];
  readonly legend?: Readonly<Partial<Record<LegendKey, string>>>;
}

export function defineFlow<const Id extends string>(
  spec: FlowSpec<Id>,
): FlowSpec<Id> {
  return spec;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface Insets {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface LaidOutNode extends Box {
  readonly id: string;
  readonly spec: FlowNodeSpec;
  readonly shape: string;
  readonly rim?: string;
  readonly inset: Insets;
}

export interface EdgeLabel extends Point {
  readonly text: string;
  readonly side: LabelSide;
}

export interface LaidOutEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: FlowEdgeKind;
  readonly path: string;
  readonly arrow: string;
  readonly points: readonly Point[];
  readonly label?: EdgeLabel;
}

export interface LaidOutGroup extends Box {
  readonly spec: FlowGroupSpec;
}

export interface FlowLayout {
  readonly width: number;
  readonly height: number;
  readonly nodes: readonly LaidOutNode[];
  readonly edges: readonly LaidOutEdge[];
  readonly groups: readonly LaidOutGroup[];
}

const NORMAL: Record<Side, Point> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};
const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};
const CORNER_RADIUS = 7;
const HOP_RADIUS = 4.5;
const ARROW_LENGTH = 8.5;
const ARROW_WIDTH = 7;
const PORT_GAP = 14;
const STRAIGHT_INSET = 9;
const GROUP_PAD = { x: 14, label: 30, edge: 14 };

interface Grid {
  readonly left: readonly number[];
  readonly widths: readonly number[];
  readonly rows: number;
  readonly rowHeight: number;
  readonly columnGap: number;
  readonly rowGap: number;
  readonly marginX: number;
  readonly marginY: number;
  readonly width: number;
  readonly height: number;
}

function measure(spec: FlowGridSpec): Grid {
  const rowHeight = spec.rowHeight ?? 56;
  const columnGap = spec.columnGap ?? 32;
  const rowGap = spec.rowGap ?? 40;
  const margin = spec.margin ?? 24;
  const marginX = typeof margin === 'number' ? margin : margin.x;
  const marginY = typeof margin === 'number' ? margin : margin.y;
  const left: number[] = [];
  let x = marginX;
  for (const width of spec.columns) {
    left.push(x);
    x += width + columnGap;
  }
  return {
    left,
    widths: spec.columns,
    rows: spec.rows,
    rowHeight,
    columnGap,
    rowGap,
    marginX,
    marginY,
    width: x - columnGap + marginX,
    height: 2 * marginY + spec.rows * rowHeight + (spec.rows - 1) * rowGap,
  };
}

const rowTop = (grid: Grid, row: number) =>
  grid.marginY + row * (grid.rowHeight + grid.rowGap);

function columnSpan(grid: Grid, col: number, cols: number) {
  let width = (cols - 1) * grid.columnGap;
  for (let c = col; c < col + cols; c++) width += grid.widths[c];
  return { x: grid.left[col], width };
}

function boundaryX(grid: Grid, index: number) {
  if (index <= 0) return grid.marginX / 2;
  if (index >= grid.widths.length) return grid.width - grid.marginX / 2;
  return grid.left[index] - grid.columnGap / 2;
}

function boundaryY(grid: Grid, index: number) {
  if (index <= 0) return grid.marginY / 2;
  if (index >= grid.rows) return grid.height - grid.marginY / 2;
  return rowTop(grid, index) - grid.rowGap / 2;
}

const round = (value: number) => Math.round(value * 100) / 100;
const fmt = (point: Point) => `${round(point.x)} ${round(point.y)}`;

const storeRadius = (box: Box) => Math.min(7, box.height / 6);
const topicRadius = (box: Box) => Math.min(9, box.width / 8);

function shapeOf(kind: NodeKind, box: Box) {
  const { x, y, width: w, height: h } = box;
  if (kind === 'store') {
    const ry = storeRadius(box);
    return {
      shape: `M ${x} ${y + ry} A ${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry} V ${y + h - ry} A ${w / 2} ${ry} 0 0 1 ${x} ${y + h - ry} Z`,
      rim: `M ${x} ${y + ry} A ${w / 2} ${ry} 0 0 0 ${x + w} ${y + ry}`,
      inset: { top: 2 * ry + 1, right: 8, bottom: ry + 1, left: 8 },
    };
  }
  if (kind === 'topic') {
    const rx = topicRadius(box);
    const ry = h / 2;
    return {
      shape: `M ${x + rx} ${y} H ${x + w - rx} A ${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h} H ${x + rx} A ${rx} ${ry} 0 0 1 ${x + rx} ${y} Z`,
      rim: `M ${x + rx} ${y} A ${rx} ${ry} 0 0 1 ${x + rx} ${y + h}`,
      inset: { top: 4, right: rx + 3, bottom: 4, left: 2 * rx + 4 },
    };
  }
  const radius = kind === 'actor' ? 4 : 8;
  return {
    shape: `M ${x + radius} ${y} H ${x + w - radius} Q ${x + w} ${y} ${x + w} ${y + radius} V ${y + h - radius} Q ${x + w} ${y + h} ${x + w - radius} ${y + h} H ${x + radius} Q ${x} ${y + h} ${x} ${y + h - radius} V ${y + radius} Q ${x} ${y} ${x + radius} ${y} Z`,
    inset: { top: 4, right: 9, bottom: 4, left: 9 },
  };
}

function attachPoint(node: LaidOutNode, side: Side, along: number): Point {
  const { x, y, width: w, height: h } = node;
  if (side === 'top' || side === 'bottom') {
    let edge = side === 'top' ? y : y + h;
    if (node.spec.kind === 'store') {
      const ry = storeRadius(node);
      const t = (along - (x + w / 2)) / (w / 2);
      const lift = ry * (1 - Math.sqrt(Math.max(0, 1 - t * t)));
      edge = side === 'top' ? edge + lift : edge - lift;
    }
    return { x: along, y: edge };
  }
  let edge = side === 'left' ? x : x + w;
  if (node.spec.kind === 'topic') {
    const rx = topicRadius(node);
    const s = (along - (y + h / 2)) / (h / 2);
    const inset = rx * (1 - Math.sqrt(Math.max(0, 1 - s * s)));
    edge = side === 'left' ? edge + inset : edge - inset;
  }
  return { x: edge, y: along };
}

function sideRange(node: Box, side: Side): [number, number] {
  return side === 'top' || side === 'bottom'
    ? [node.x, node.x + node.width]
    : [node.y, node.y + node.height];
}

const center = (node: Box, side: Side) =>
  side === 'top' || side === 'bottom'
    ? node.x + node.width / 2
    : node.y + node.height / 2;

function defaultEnter(exit: Side, a: Box, b: Box): Side {
  const right = b.x >= a.x + a.width;
  const left = b.x + b.width <= a.x;
  const below = b.y >= a.y + a.height;
  const above = b.y + b.height <= a.y;
  if (exit === 'top' || exit === 'bottom') {
    if (exit === 'top' ? above : below) return OPPOSITE[exit];
    return right ? 'left' : left ? 'right' : exit;
  }
  if (exit === 'right' ? right : left) return OPPOSITE[exit];
  return below ? 'top' : above ? 'bottom' : exit;
}

function chooseSides(
  edge: FlowEdgeSpec<string>,
  a: Box,
  b: Box,
  direction: 'down' | 'right',
): [Side, Side] {
  if (edge.exit && edge.enter) return [edge.exit, edge.enter];
  if (edge.exit) return [edge.exit, defaultEnter(edge.exit, a, b)];
  if (edge.enter) return [defaultEnter(edge.enter, b, a), edge.enter];
  const horizontal: [Side, Side] | undefined =
    b.x >= a.x + a.width
      ? ['right', 'left']
      : b.x + b.width <= a.x
        ? ['left', 'right']
        : undefined;
  const vertical: [Side, Side] | undefined =
    b.y >= a.y + a.height
      ? ['bottom', 'top']
      : b.y + b.height <= a.y
        ? ['top', 'bottom']
        : undefined;
  const sides =
    direction === 'right' ? (horizontal ?? vertical) : (vertical ?? horizontal);
  if (!sides) throw new Error(`overlapping nodes cannot be connected`);
  return sides;
}

interface Attachment {
  readonly edge: number;
  readonly end: 'from' | 'to';
  readonly fixed?: number;
  readonly preferred: number;
}

function spread(items: Attachment[], range: [number, number]) {
  const inset = Math.min(14, (range[1] - range[0]) / 4);
  const low = range[0] + inset;
  const high = range[1] - inset;
  const clampFree = (value: number) => Math.min(high, Math.max(low, value));
  const ordered = [...items].sort(
    (p, q) => (p.fixed ?? p.preferred) - (q.fixed ?? q.preferred),
  );
  const positions = ordered.map(
    (item) => item.fixed ?? clampFree(item.preferred),
  );
  for (let i = 1; i < ordered.length; i++)
    if (
      ordered[i].fixed === undefined &&
      positions[i] < positions[i - 1] + PORT_GAP
    )
      positions[i] = positions[i - 1] + PORT_GAP;
  for (let i = ordered.length - 2; i >= 0; i--)
    if (
      ordered[i].fixed === undefined &&
      positions[i] > positions[i + 1] - PORT_GAP
    )
      positions[i] = positions[i + 1] - PORT_GAP;
  return ordered.map((item, i) => ({
    item,
    position: item.fixed ?? clampFree(positions[i]),
  }));
}

function route(
  edge: FlowEdgeSpec<string>,
  [exit, enter]: [Side, Side],
  start: Point,
  end: Point,
  grid: Grid,
): Point[] {
  const out = NORMAL[exit];
  const back = NORMAL[enter];
  const horizontalExit = exit === 'left' || exit === 'right';
  const horizontalEnter = enter === 'left' || enter === 'right';
  if (horizontalExit !== horizontalEnter) {
    const corner = horizontalExit
      ? { x: end.x, y: start.y }
      : { x: start.x, y: end.y };
    const ahead =
      (corner.x - start.x) * out.x + (corner.y - start.y) * out.y > 0;
    const outside =
      (corner.x - end.x) * back.x + (corner.y - end.y) * back.y > 0;
    if (!ahead || !outside)
      throw new Error(`cannot draw an elbow from ${exit} to ${enter}`);
    return [start, corner, end];
  }
  if (exit === enter) {
    if (horizontalExit) {
      const x =
        edge.channel !== undefined
          ? boundaryX(grid, edge.channel)
          : out.x > 0
            ? Math.max(start.x, end.x) + grid.columnGap / 2
            : Math.min(start.x, end.x) - grid.columnGap / 2;
      return [start, { x, y: start.y }, { x, y: end.y }, end];
    }
    const y =
      edge.channel !== undefined
        ? boundaryY(grid, edge.channel)
        : out.y > 0
          ? Math.max(start.y, end.y) + grid.rowGap / 2
          : Math.min(start.y, end.y) - grid.rowGap / 2;
    return [start, { x: start.x, y }, { x: end.x, y }, end];
  }
  if (horizontalExit) {
    if (Math.abs(start.y - end.y) < 0.5) return [start, end];
    const x =
      edge.channel !== undefined
        ? boundaryX(grid, edge.channel)
        : end.x + back.x * (grid.columnGap / 2);
    if ((x - start.x) * out.x <= 0 || (end.x - x) * out.x <= 0)
      throw new Error(`the ${exit} to ${enter} channel is not between nodes`);
    return [start, { x, y: start.y }, { x, y: end.y }, end];
  }
  if (Math.abs(start.x - end.x) < 0.5) return [start, end];
  const y =
    edge.channel !== undefined
      ? boundaryY(grid, edge.channel)
      : end.y + back.y * (grid.rowGap / 2);
  if ((y - start.y) * out.y <= 0 || (end.y - y) * out.y <= 0)
    throw new Error(`the ${exit} to ${enter} channel is not between nodes`);
  return [start, { x: start.x, y }, { x: end.x, y }, end];
}

interface Segment {
  readonly a: Point;
  readonly b: Point;
  readonly edge: number;
  readonly index: number;
}

const horizontal = (s: Segment) => Math.abs(s.a.y - s.b.y) < 0.01;

function segmentsOf(points: readonly Point[], edge: number): Segment[] {
  return points.slice(1).map((b, i) => ({ a: points[i], b, edge, index: i }));
}

function overlaps(a: Box, b: Box) {
  return (
    a.x < b.x + b.width - 0.5 &&
    b.x < a.x + a.width - 0.5 &&
    a.y < b.y + b.height - 0.5 &&
    b.y < a.y + a.height - 0.5
  );
}

function crossesBox(s: Segment, box: Box, shrink: number) {
  const left = box.x + shrink;
  const right = box.x + box.width - shrink;
  const top = box.y + shrink;
  const bottom = box.y + box.height - shrink;
  const minX = Math.min(s.a.x, s.b.x);
  const maxX = Math.max(s.a.x, s.b.x);
  const minY = Math.min(s.a.y, s.b.y);
  const maxY = Math.max(s.a.y, s.b.y);
  return minX < right && maxX > left && minY < bottom && maxY > top;
}

function overlapLength(p: Segment, q: Segment) {
  if (horizontal(p) !== horizontal(q)) return 0;
  if (horizontal(p)) {
    if (Math.abs(p.a.y - q.a.y) > 1) return 0;
    const low = Math.max(Math.min(p.a.x, p.b.x), Math.min(q.a.x, q.b.x));
    const high = Math.min(Math.max(p.a.x, p.b.x), Math.max(q.a.x, q.b.x));
    return high - low;
  }
  if (Math.abs(p.a.x - q.a.x) > 1) return 0;
  const low = Math.max(Math.min(p.a.y, p.b.y), Math.min(q.a.y, q.b.y));
  const high = Math.min(Math.max(p.a.y, p.b.y), Math.max(q.a.y, q.b.y));
  return high - low;
}

function unit(a: Point, b: Point): Point {
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / length, y: (b.y - a.y) / length };
}

function drawPath(points: readonly Point[], hops: readonly number[][]) {
  const count = points.length;
  const direction = points.slice(1).map((b, i) => unit(points[i], b));
  const lengths = points
    .slice(1)
    .map((b, i) => Math.hypot(b.x - points[i].x, b.y - points[i].y));
  const radius = points.map((_, i) =>
    i === 0 || i === count - 1
      ? 0
      : Math.min(CORNER_RADIUS, lengths[i - 1] / 2, lengths[i] / 2),
  );
  let d = `M ${fmt(points[0])}`;
  for (let i = 0; i < count - 1; i++) {
    const u = direction[i];
    for (const x of hops[i] ?? []) {
      const y = points[i].y;
      d += ` L ${fmt({ x: x - u.x * HOP_RADIUS, y })} A ${HOP_RADIUS} ${HOP_RADIUS} 0 0 ${u.x > 0 ? 1 : 0} ${fmt({ x: x + u.x * HOP_RADIUS, y })}`;
    }
    const corner = points[i + 1];
    const r = radius[i + 1];
    d += ` L ${fmt({ x: corner.x - u.x * r, y: corner.y - u.y * r })}`;
    if (i + 1 < count - 1) {
      const v = direction[i + 1];
      d += ` Q ${fmt(corner)} ${fmt({ x: corner.x + v.x * r, y: corner.y + v.y * r })}`;
    }
  }
  return d;
}

function pointAlong(points: readonly Point[], fraction: number): Point {
  const lengths = points
    .slice(1)
    .map((b, i) => Math.hypot(b.x - points[i].x, b.y - points[i].y));
  let remaining = lengths.reduce((sum, value) => sum + value, 0) * fraction;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const u = unit(points[i], points[i + 1]);
      return {
        x: points[i].x + u.x * remaining,
        y: points[i].y + u.y * remaining,
      };
    }
    remaining -= lengths[i];
  }
  return points[points.length - 1];
}

function labelAnchor(points: readonly Point[], at?: number): Point {
  if (at !== undefined) return pointAlong(points, at);
  let best = 0;
  let bestLength = -1;
  for (let i = 0; i < points.length - 1; i++) {
    const length = Math.hypot(
      points[i + 1].x - points[i].x,
      points[i + 1].y - points[i].y,
    );
    if (length > bestLength + 0.5) {
      best = i;
      bestLength = length;
    }
  }
  return {
    x: (points[best].x + points[best + 1].x) / 2,
    y: (points[best].y + points[best + 1].y) / 2,
  };
}

export function layoutFlow(spec: FlowSpec): FlowLayout {
  const fail = (message: string): never => {
    throw new Error(`Diagram "${spec.title}": ${message}`);
  };
  const grid = measure(spec.grid);
  const columns = grid.widths.length;
  const nodes = new Map<string, LaidOutNode>();
  for (const [id, node] of Object.entries(spec.nodes) as [
    string,
    FlowNodeSpec,
  ][]) {
    const cols = node.cols ?? 1;
    const rows = node.rows ?? 1;
    if (
      !Number.isInteger(node.col) ||
      node.col < 0 ||
      node.col + cols > columns
    )
      fail(`node ${id} is outside the ${columns} grid columns`);
    if (node.row < 0 || node.row + rows > grid.rows)
      fail(`node ${id} is outside the ${grid.rows} grid rows`);
    const { x, width } = columnSpan(grid, node.col, cols);
    const box = {
      x,
      y: rowTop(grid, node.row),
      width,
      height: rows * grid.rowHeight + (rows - 1) * grid.rowGap,
    };
    for (const other of nodes.values())
      if (overlaps(box, other)) fail(`nodes ${other.id} and ${id} overlap`);
    nodes.set(id, { id, spec: node, ...box, ...shapeOf(node.kind, box) });
  }
  const node = (id: string) => nodes.get(id) ?? fail(`unknown node ${id}`);
  const sides = spec.edges.map((edge) => {
    try {
      return chooseSides(
        edge,
        node(edge.from),
        node(edge.to),
        spec.direction ?? 'down',
      );
    } catch (error) {
      return fail(`${edge.from} → ${edge.to}: ${(error as Error).message}`);
    }
  });
  const pin = (
    target: LaidOutNode,
    side: Side,
    at?: number,
    col?: number,
    row?: number,
  ) => {
    const vertical = side === 'top' || side === 'bottom';
    const [low, high] = sideRange(target, side);
    if (
      col !== undefined &&
      !(Number.isInteger(col) && col >= 0 && col < columns)
    )
      fail(`column ${col} does not exist`);
    if (row !== undefined && !(row >= 0 && row < grid.rows))
      fail(`row ${row} does not exist`);
    const value =
      vertical && col !== undefined
        ? grid.left[col] + grid.widths[col] / 2
        : !vertical && row !== undefined
          ? rowTop(grid, row) + grid.rowHeight / 2
          : at !== undefined
            ? low + at * (high - low)
            : undefined;
    if (value !== undefined && (value < low || value > high))
      fail(`a port of ${target.id} falls outside its ${side} side`);
    return value;
  };
  const attachments = new Map<string, Attachment[]>();
  const attach = (id: string, side: Side, attachment: Attachment) => {
    const key = `${id}:${side}`;
    attachments.set(key, [...(attachments.get(key) ?? []), attachment]);
  };
  spec.edges.forEach((edge, i) => {
    const a = node(edge.from);
    const b = node(edge.to);
    const [exit, enter] = sides[i];
    const [aLow, aHigh] = sideRange(a, exit);
    const [bLow, bHigh] = sideRange(b, enter);
    let exitFixed = pin(a, exit, edge.exitAt, edge.exitCol, edge.exitRow);
    let enterFixed = pin(b, enter, edge.enterAt, edge.enterCol, edge.enterRow);
    if (exit === OPPOSITE[enter]) {
      const low = Math.max(aLow, bLow) + STRAIGHT_INSET;
      const high = Math.min(aHigh, bHigh) - STRAIGHT_INSET;
      const within = (value: number) => value >= low && value <= high;
      if (exitFixed === undefined && enterFixed === undefined) {
        if (high >= low) {
          const narrow = aHigh - aLow < bHigh - bLow ? a : b;
          exitFixed = enterFixed = Math.min(
            high,
            Math.max(low, center(narrow, exit)),
          );
        }
      } else if (enterFixed === undefined && within(exitFixed!)) {
        enterFixed = exitFixed;
      } else if (exitFixed === undefined && within(enterFixed!)) {
        exitFixed = enterFixed;
      }
    }
    const around = exit === enter;
    attach(edge.from, exit, {
      edge: i,
      end: 'from',
      fixed: exitFixed,
      preferred: center(around ? a : b, exit),
    });
    attach(edge.to, enter, {
      edge: i,
      end: 'to',
      fixed: enterFixed,
      preferred: center(around ? b : a, enter),
    });
  });
  const ports = spec.edges.map(() => ({}) as { from?: Point; to?: Point });
  for (const [key, items] of attachments) {
    const separator = key.lastIndexOf(':');
    const target = node(key.slice(0, separator));
    const side = key.slice(separator + 1) as Side;
    for (const { item, position } of spread(items, sideRange(target, side)))
      ports[item.edge][item.end] = attachPoint(target, side, position);
  }
  const routes = spec.edges.map((edge, i) => {
    try {
      return route(edge, sides[i], ports[i].from!, ports[i].to!, grid);
    } catch (error) {
      return fail(`${edge.from} → ${edge.to}: ${(error as Error).message}`);
    }
  });
  const segments = routes.flatMap((points, i) => segmentsOf(points, i));
  for (const segment of segments) {
    const edge = spec.edges[segment.edge];
    for (const other of nodes.values()) {
      const endpoint = other.id === edge.from || other.id === edge.to;
      const curve =
        other.spec.kind === 'store' || other.spec.kind === 'topic' ? 10 : 0;
      if (crossesBox(segment, other, endpoint ? curve + 2 : -2))
        fail(
          `${edge.from} → ${edge.to} runs through ${other.id}; set exit, enter, or channel`,
        );
    }
    for (const other of segments)
      if (other.edge > segment.edge && overlapLength(segment, other) > 1)
        fail(
          `${edge.from} → ${edge.to} overlaps ${spec.edges[other.edge].from} → ${spec.edges[other.edge].to}`,
        );
  }
  const hops = routes.map((points, i) =>
    segmentsOf(points, i).map((segment) => {
      if (!horizontal(segment)) return [];
      const minX = Math.min(segment.a.x, segment.b.x);
      const maxX = Math.max(segment.a.x, segment.b.x);
      const margin = CORNER_RADIUS + HOP_RADIUS + 1;
      return segments
        .filter(
          (other) =>
            other.edge !== i &&
            !horizontal(other) &&
            other.a.x > minX + margin &&
            other.a.x < maxX - margin &&
            segment.a.y > Math.min(other.a.y, other.b.y) + margin &&
            segment.a.y < Math.max(other.a.y, other.b.y) - margin,
        )
        .map((other) => other.a.x)
        .sort((p, q) => (segment.b.x > segment.a.x ? p - q : q - p));
    }),
  );
  const edges = spec.edges.map((edge, i): LaidOutEdge => {
    const points = routes[i];
    const tip = points[points.length - 1];
    const u = unit(points[points.length - 2], tip);
    const base = {
      x: tip.x - u.x * ARROW_LENGTH,
      y: tip.y - u.y * ARROW_LENGTH,
    };
    const wing = { x: -u.y * (ARROW_WIDTH / 2), y: u.x * (ARROW_WIDTH / 2) };
    const anchor = labelAnchor(points, edge.labelAt);
    return {
      from: edge.from,
      to: edge.to,
      kind: edge.kind ?? 'data',
      points,
      path: drawPath([...points.slice(0, -1), base], hops[i]),
      arrow: `M ${fmt({ x: base.x + wing.x, y: base.y + wing.y })} L ${fmt(tip)} L ${fmt({ x: base.x - wing.x, y: base.y - wing.y })} Z`,
      label: edge.label
        ? { ...anchor, text: edge.label, side: edge.labelSide ?? 'on' }
        : undefined,
    };
  });
  const groups = (spec.groups ?? []).map((group): LaidOutGroup => {
    const [firstCol, lastCol] = group.cols;
    const [firstRow, lastRow] = group.rows;
    if (
      firstCol < 0 ||
      lastCol >= columns ||
      firstRow < 0 ||
      lastRow >= grid.rows
    )
      fail(`group ${group.label} is outside the grid`);
    const labelled = (group.labelPosition ?? 'top-left').startsWith('top');
    const left = grid.left[firstCol] - GROUP_PAD.x;
    const right = grid.left[lastCol] + grid.widths[lastCol] + GROUP_PAD.x;
    const top =
      rowTop(grid, firstRow) - (labelled ? GROUP_PAD.label : GROUP_PAD.edge);
    const bottom =
      rowTop(grid, lastRow) +
      grid.rowHeight +
      (labelled ? GROUP_PAD.edge : GROUP_PAD.label);
    if (left < 0 || top < 0 || right > grid.width || bottom > grid.height)
      fail(`group ${group.label} needs a larger grid margin`);
    return {
      spec: group,
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };
  });
  return {
    width: grid.width,
    height: grid.height,
    nodes: Array.from(nodes.values()),
    edges,
    groups,
  };
}

export function describeFlow(spec: FlowSpec): string {
  const name = (id: string) => spec.nodes[id]?.label ?? id;
  const connections = spec.edges.map(
    (edge) =>
      `${name(edge.from)} to ${name(edge.to)}${edge.label ? ` (${edge.label})` : ''}`,
  );
  return `Connections: ${connections.join('; ')}.`;
}
