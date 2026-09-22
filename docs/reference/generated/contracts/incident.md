---
title: "Incident contract"
description: "Canonical seagull.incident.v1 messages and field definitions."
---

This is the pinned `seagull.incident.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## Confidence

```protobuf
enum Confidence {
  CONFIDENCE_UNSPECIFIED = 0;

  // The clocks disagreed by more than the whole window the rule looks through,
  // so nothing in the data supports the order the story is told in.
  CONFIDENCE_LOW = 1;

  // The clocks disagreed by more than the story lasted but less than the window
  // it was found in: the events belong together and the order between them is
  // not established.
  CONFIDENCE_MEDIUM = 2;

  // The clocks disagreed by less than the story lasted, so the order is
  // established by the data.
  CONFIDENCE_HIGH = 3;
}
```

## State

```protobuf
enum State {
  STATE_UNSPECIFIED = 0;
  STATE_OPEN = 1;
  STATE_ACKNOWLEDGED = 2;
  STATE_IN_INVESTIGATION = 3;
  STATE_RESOLVED = 4;
  STATE_FALSE_POSITIVE = 5;
}
```

## Closure

```protobuf
message Closure {
  State state = 1;
  string reason = 2;
  string closed_by = 3;
  google.protobuf.Timestamp closed_at = 4;
}
```

## Incident

```protobuf
message Incident {
  // The correlation detection that told this story, so re-deciding the same
  // events against the same rule finds the incident that already exists rather
  // than opening a second one.
  string incident_id = 1;
  uint32 schema_version = 2;
  string tenant_id = 3;

  // Where the story came from. The detection carries the evidence and the
  // events; this names it rather than copying it, so an incident can be traced
  // back to exactly what produced it.
  string detection_id = 4;
  seagull.detection.v1.Rule rule = 5;
  string ruleset_id = 6;

  // What the rule says it matters, and what the platform measured about the
  // order it rests on. Severity is the rule author's and confidence is not:
  // a rule cannot declare how well the clocks of an estate agree.
  seagull.detection.v1.Severity severity = 7;
  Confidence confidence = 8;
  seagull.detection.v1.Technique technique = 9;

  seagull.event.v1.EventClass event_class = 10;
  string agent_id = 11;

  // What the story is made of: one event per stage, in the order the rule
  // declares them. This is the trace to the component events, and it is bounded
  // by the stages a rule may declare rather than by how much an attacker sent.
  repeated seagull.detection.v1.Stage stages = 12;

  // What made these events one story rather than several: the fields the rule
  // grouped by, and what the events held in them. It is what an incident is
  // about — an address, a host, an account — and it is copied so that a list
  // says what each story concerns without reading the detection behind it.
  repeated seagull.detection.v1.Grouping group = 13;

  // How far back the rule was told to look, and how much the clocks that timed
  // the story disagreed. Both are carried because `confidence` is derived from
  // them, and a level nobody can check is a level nobody should trust.
  google.protobuf.Duration window = 14;
  google.protobuf.Duration clock_spread = 15;

  // When the story began and ended, taken from the events it is made of, and
  // when the platform put it in front of a person.
  google.protobuf.Timestamp first_event_time = 16;
  google.protobuf.Timestamp last_event_time = 17;
  google.protobuf.Timestamp raised_at = 18;

  State state = 19;
  string assignee = 20;

  // Who last moved it and when. The whole trail is a separate read: this is the
  // last line of it, carried so a list does not need one query per row.
  string changed_by = 21;
  google.protobuf.Timestamp changed_at = 22;

  // Moves by one on every transition, and a caller may say which revision it
  // believed it was acting on. Two analysts acting at once means the second is
  // told the incident moved rather than quietly overwriting the first.
  uint64 revision = 23;

  Closure closure = 24;
}
```

## Transition

```protobuf
message Transition {
  string incident_id = 1;
  uint64 revision = 2;
  State from = 3;
  State to = 4;
  string assignee = 5;
  string actor = 6;
  google.protobuf.Timestamp at = 7;
  string note = 8;
}
```

## History

```protobuf
message History {
  string incident_id = 1;
  repeated Transition transitions = 2;
}
```

## TransitionRequest

```protobuf
message TransitionRequest {
  State to = 1;

  // Required when closing as a false positive and when reopening: both say the
  // platform or an earlier decision was wrong, and neither is worth recording
  // without the why.
  string note = 2;

  // Zero acts on whatever the incident currently is. Otherwise the revision the
  // caller believed it was acting on, and a mismatch is refused.
  uint64 expected_revision = 3;
}
```

## AssignmentRequest

```protobuf
message AssignmentRequest {
  string assignee = 1;
  string note = 2;
  uint64 expected_revision = 3;
}
```

## Query

```protobuf
message Query {
  // Over raised_at, and optional: an incident list is small enough to answer
  // without one, which a telemetry hunt is not.
  seagull.hunt.v1.TimeRange range = 1;

  repeated State states = 2;
  repeated seagull.detection.v1.Severity severities = 3;
  repeated Confidence confidences = 4;
  string assignee = 5;
  string rule_id = 6;
  string agent_id = 7;

  // Zero asks for the server's default. The server caps it either way.
  uint32 limit = 8;

  // Empty asks for the first page. Otherwise the `next_cursor` of the page
  // before it, unchanged: it is the server's own token and is not composed by a
  // caller.
  string cursor = 9;
}
```

## Page

```protobuf
message Page {
  repeated Incident incidents = 1;
  string next_cursor = 2;
}
```


## Source evidence

Generated from [`proto/seagull/incident/v1/incident.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/incident/v1/incident.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
