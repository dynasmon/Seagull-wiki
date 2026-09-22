---
title: "Hunt contract"
description: "Canonical seagull.hunt.v1 messages and field definitions."
---

This is the pinned `seagull.hunt.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## Operator

```protobuf
enum Operator {
  OPERATOR_UNSPECIFIED = 0;
  OPERATOR_EQUALS = 1;
  OPERATOR_ONE_OF = 2;
  OPERATOR_CONTAINS = 3;
  OPERATOR_STARTS_WITH = 4;
  OPERATOR_ENDS_WITH = 5;
  OPERATOR_ABOVE = 6;
  OPERATOR_AT_LEAST = 7;
  OPERATOR_BELOW = 8;
  OPERATOR_AT_MOST = 9;
  OPERATOR_PRESENT = 10;
}
```

## Predicate

```protobuf
message Predicate {
  string field = 1;
  Operator operator = 2;

  // Written the way a person says it: `failure`, not `OUTCOME_FAILURE`; `1024`,
  // not a number field of its own. The server holds each literal to what the
  // field is declared to carry.
  repeated string values = 3;
}
```

## Group

```protobuf
message Group {
  repeated Expression terms = 1;
}
```

## Expression

```protobuf
message Expression {
  oneof form {
    Predicate predicate = 1;
    Group all = 2;
    Group any = 3;
    Expression negated = 4;
  }
}
```

## TimeRange

```protobuf
message TimeRange {
  google.protobuf.Timestamp start = 1;
  google.protobuf.Timestamp end = 2;
}
```

## Query

```protobuf
message Query {
  TimeRange range = 1;
  Expression where = 2;

  // Zero asks for the server's default. The server caps it either way.
  uint32 limit = 3;

  // Empty asks for the first page. Otherwise the `next_cursor` of the page
  // before it, unchanged: it is the server's own token and is not composed by a
  // caller.
  string cursor = 4;
}
```

## EventPage

```protobuf
message EventPage {
  repeated seagull.event.v1.Event events = 1;
  string next_cursor = 2;
}
```

## DetectionPage

```protobuf
message DetectionPage {
  repeated seagull.detection.v1.Detection detections = 1;
  string next_cursor = 2;
}
```

## Refusal

```protobuf
message Refusal {
  string code = 1;
  string detail = 2;
  string field = 3;
}
```


## Source evidence

Generated from [`proto/seagull/hunt/v1/hunt.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/hunt/v1/hunt.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
