---
title: "Alert contract"
description: "Canonical seagull.alert.v1 messages and field definitions."
---

This is the pinned `seagull.alert.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

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

## Alert

```protobuf
message Alert {
  // The detection this is about. One alert per detection, so re-deciding the
  // same events against the same rule finds the alert that already exists
  // rather than raising a second one.
  string alert_id = 1;
  uint32 schema_version = 2;

  string tenant_id = 3;
  string detection_id = 4;

  seagull.detection.v1.Rule rule = 5;
  seagull.detection.v1.Severity severity = 6;
  seagull.detection.v1.Technique technique = 7;
  seagull.event.v1.EventClass event_class = 8;
  string agent_id = 9;

  // When the thing happened, and when the platform put it in front of a person.
  google.protobuf.Timestamp event_time = 10;
  google.protobuf.Timestamp raised_at = 11;

  State state = 12;
  string assignee = 13;

  // Who last moved it and when. The whole trail is a separate read: this is the
  // last line of it, carried so a list does not need one query per row.
  string changed_by = 14;
  google.protobuf.Timestamp changed_at = 15;

  // Moves by one on every transition, and a caller may say which revision it
  // believed it was acting on. Two analysts acting at once means the second is
  // told the alert moved rather than quietly overwriting the first.
  uint64 revision = 16;

  Closure closure = 17;

  // What makes two detections the same piece of work: a digest of the rule, the
  // tenant, and whatever else the estate declared the alert is keyed by. Two
  // detections sharing it fold into one alert instead of raising two.
  string correlation_key = 18;

  // How many detections this alert is made of, and the event times of the first
  // and the last. They are event times and not processing times, so a replay
  // decides the same way however long afterwards it runs.
  uint64 occurrences = 19;
  google.protobuf.Timestamp first_seen = 20;
  google.protobuf.Timestamp last_seen = 21;
}
```

## Occurrence

```protobuf
message Occurrence {
  string detection_id = 1;
  google.protobuf.Timestamp event_time = 2;
  google.protobuf.Timestamp folded_at = 3;
}
```

## Occurrences

```protobuf
message Occurrences {
  string alert_id = 1;
  repeated Occurrence occurrences = 2;
  string next_cursor = 3;
}
```

## Transition

```protobuf
message Transition {
  string alert_id = 1;
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
  string alert_id = 1;
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

  // Zero acts on whatever the alert currently is. Otherwise the revision the
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
  // Over raised_at, and optional: an alert list is small enough to answer
  // without one, which a telemetry hunt is not.
  seagull.hunt.v1.TimeRange range = 1;

  repeated State states = 2;
  repeated seagull.detection.v1.Severity severities = 3;
  string assignee = 4;
  string rule_id = 5;
  string agent_id = 6;

  // Zero asks for the server's default. The server caps it either way.
  uint32 limit = 7;

  // Empty asks for the first page. Otherwise the `next_cursor` of the page
  // before it, unchanged: it is the server's own token and is not composed by a
  // caller.
  string cursor = 8;
}
```

## Page

```protobuf
message Page {
  repeated Alert alerts = 1;
  string next_cursor = 2;
}
```


## Source evidence

Generated from [`proto/seagull/alert/v1/alert.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/alert/v1/alert.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
