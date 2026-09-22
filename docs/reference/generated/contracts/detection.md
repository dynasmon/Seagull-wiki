---
title: "Detection contract"
description: "Canonical seagull.detection.v1 messages and field definitions."
---

This is the pinned `seagull.detection.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## Severity

```protobuf
enum Severity {
  SEVERITY_UNSPECIFIED = 0;
  SEVERITY_LOW = 1;
  SEVERITY_MEDIUM = 2;
  SEVERITY_HIGH = 3;
  SEVERITY_CRITICAL = 4;
}
```

## Rule

```protobuf
message Rule {
  string id = 1;
  uint32 revision = 2;
  string name = 3;
  Source source = 4;
}
```

## Source

```protobuf
message Source {
  string catalogue = 1;
  string identifier = 2;
}
```

## Technique

```protobuf
message Technique {
  string tactic = 1;
  string id = 2;
  string name = 3;
}
```

## Evidence

```protobuf
message Evidence {
  string field = 1;
  string operator = 2;
  bool negated = 3;

  // What the event held, written the way a rule writes a literal. Empty when
  // absent is set: the event did not carry the field at all, which is a
  // different observation from carrying nothing.
  string held = 4;
  bool absent = 5;
}
```

## Grouping

```protobuf
message Grouping {
  string field = 1;
  string value = 2;
  bool absent = 3;
}
```

## Aggregation

```protobuf
message Aggregation {
  // What the window held when this was decided, and what the rule asked for.
  // Both, because a count means nothing without the threshold it crossed.
  uint32 count = 1;
  uint32 threshold = 2;

  // How far back the rule was told to look, and the oldest event still inside
  // the window. With `event_time`, which is the newest, the two bound the
  // activity that was counted.
  google.protobuf.Duration window = 3;
  google.protobuf.Timestamp first_event_time = 4;

  // The window held as many events as it is allowed to, so `count` is a floor
  // rather than a total.
  bool saturated = 5;

  repeated Grouping group = 6;
}
```

## Stage

```protobuf
message Stage {
  string name = 1;
  string event_id = 2;
  google.protobuf.Timestamp event_time = 3;
}
```

## Correlation

```protobuf
message Correlation {
  // One per stage, in the order the rule declares them, each naming the event
  // that satisfied it. The events are also carried in `source_event_ids`; this
  // says which of them played which part.
  repeated Stage stages = 1;

  // How far back the rule was told to look. The span the events actually
  // covered is the difference between the first and last stage above.
  google.protobuf.Duration window = 2;

  // How much the clocks that timed this sequence disagreed, measured as the
  // spread of `observed_time` against `ingest_time` across the events above.
  // Ordering is decided in event time, which is the producer's clock, so a
  // spread wider than the span means the order is not established by the data.
  google.protobuf.Duration clock_spread = 3;

  repeated Grouping group = 4;
}
```

## Detection

```protobuf
message Detection {
  // Derived from the rule, its revision, and the events it was decided from, so
  // that deciding the same events against the same rule twice names the same
  // detection. A replay therefore rewrites what it already wrote instead of
  // adding a second copy of it.
  string detection_id = 1;
  uint32 schema_version = 2;

  Rule rule = 3;

  // The set of rules the deciding process was pinned to, named by what is in
  // it, so a detection can be traced back to exactly what decided it.
  string ruleset_id = 4;

  Severity severity = 5;
  Technique technique = 6;

  seagull.event.v1.EventClass event_class = 7;
  seagull.event.v1.Origin origin = 8;
  repeated string source_event_ids = 9;

  // When the thing happened, taken from the events it was decided from, and
  // when the platform decided it. The first places a detection on a timeline;
  // the second says when this evaluation ran and is not part of its identity.
  google.protobuf.Timestamp event_time = 10;
  google.protobuf.Timestamp detected_time = 11;

  repeated Evidence evidence = 12;

  // What a counting rule counted, absent when the rule decides one event at a
  // time. The events named above are what this detection is identified by;
  // this is what they were counted against.
  Aggregation aggregation = 13;

  // What an ordered sequence found, absent on every other rule. The events
  // named above are the ones that made the sequence; this says which stage each
  // of them satisfied and how far the clocks that ordered them disagreed.
  Correlation correlation = 14;
}
```


## Source evidence

Generated from [`proto/seagull/detection/v1/detection.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/detection/v1/detection.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
