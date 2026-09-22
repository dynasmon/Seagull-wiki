---
title: "Ruleset contract"
description: "Canonical seagull.ruleset.v1 messages and field definitions."
---

This is the pinned `seagull.ruleset.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## Status

```protobuf
enum Status {
  STATUS_UNSPECIFIED = 0;
  STATUS_DRAFT = 1;
  STATUS_ACTIVE = 2;
  STATUS_DISABLED = 3;
  STATUS_DEPRECATED = 4;
}
```

## Expectation

```protobuf
enum Expectation {
  EXPECTATION_UNSPECIFIED = 0;
  EXPECTATION_MATCH = 1;
  EXPECTATION_NO_MATCH = 2;
}
```

## Value

```protobuf
message Value {
  oneof literal {
    string text = 1;
    double number = 2;
    bool truth = 3;
  }
}
```

## Predicate

```protobuf
message Predicate {
  string field = 1;
  string operator = 2;
  repeated Value values = 3;
}
```

## Terms

```protobuf
message Terms {
  repeated Expression terms = 1;
}
```

## Expression

```protobuf
message Expression {
  oneof term {
    Predicate predicate = 1;
    Terms all = 2;
    Terms any = 3;
    Expression negated = 4;
  }
}
```

## Case

```protobuf
message Case {
  string name = 1;
  string description = 2;
  Expectation expect = 3;
  map<string, Value> event = 4;
  repeated string evidence = 5;
  seagull.detection.v1.Severity severity = 6;
}
```

## Count

```protobuf
message Count {
  uint32 at_least = 1;
  google.protobuf.Duration within = 2;

  // What makes two matching events the same thing being counted, named the way
  // a rule names any other field. The tenant is always part of the grouping and
  // is never written here: a count that could span one is a number somebody
  // could read past.
  repeated string group_by = 3;
}
```

## Stage

```protobuf
message Stage {
  string name = 1;
  Expression match = 2;
}
```

## Sequence

```protobuf
message Sequence {
  repeated Stage stages = 1;
  google.protobuf.Duration within = 2;

  // What makes two events part of the same story, named the way a rule names
  // any other field. The tenant is always part of the grouping and is never
  // written here, exactly as it is never written on a count.
  repeated string group_by = 3;
}
```

## Rule

```protobuf
message Rule {
  string id = 1;
  uint32 revision = 2;
  string name = 3;
  string description = 4;
  seagull.event.v1.EventClass event_class = 5;
  Expression match = 6;
  seagull.detection.v1.Severity severity = 7;
  Status status = 8;
  seagull.detection.v1.Technique technique = 9;
  string false_positives = 10;
  string response = 11;
  seagull.detection.v1.Source source = 12;
  repeated string tags = 13;
  repeated string references = 14;
  repeated Case cases = 15;

  // Absent on a rule that decides one event at a time, which is most of them.
  Count count = 16;

  // Absent on a rule that matches. A rule carries `match` or `sequence`: the
  // stages of a sequence are what it matches with.
  Sequence sequence = 17;
}
```

## Version

```protobuf
message Version {
  string id = 1;
  repeated Rule rules = 2;
  string published_by = 3;
  google.protobuf.Timestamp published_at = 4;
  string note = 5;
}
```

## Active

```protobuf
message Active {
  string ruleset_id = 1;
  string activated_by = 2;
  google.protobuf.Timestamp activated_at = 3;
  string note = 4;
}
```

## Record

```protobuf
message Record {
  oneof record {
    Version version = 1;
    Active active = 2;
  }
}
```

## Document

```protobuf
message Document {
  string name = 1;
  bytes content = 2;
}
```

## Fault

```protobuf
message Fault {
  string source = 1;
  uint32 line = 2;
  uint32 column = 3;
  string rule = 4;
  string part = 5;
  string reason = 6;
}
```

## ValidationRequest

```protobuf
message ValidationRequest {
  repeated Document documents = 1;
}
```

## ValidationResponse

```protobuf
message ValidationResponse {
  bool valid = 1;
  string ruleset_id = 2;
  uint32 rules = 3;
  uint32 running = 4;
  repeated Fault faults = 5;
}
```

## Unheld

```protobuf
message Unheld {
  string source = 1;
  string rule = 2;
  string case_name = 3;
  string reason = 4;
}
```

## CheckRequest

```protobuf
message CheckRequest {
  repeated Document documents = 1;
}
```

## CheckResponse

```protobuf
message CheckResponse {
  bool held = 1;
  uint32 rules = 2;
  uint32 cases = 3;
  repeated Unheld unheld = 4;
  repeated string untested = 5;
}
```

## PublishRequest

```protobuf
message PublishRequest {
  repeated Document documents = 1;
  string note = 2;
}
```

## PublishResponse

```protobuf
message PublishResponse {
  string ruleset_id = 1;
  bool published = 2;
  ValidationResponse validation = 3;
  CheckResponse check = 4;
}
```

## ActivationRequest

```protobuf
message ActivationRequest {
  string ruleset_id = 1;
  string note = 2;
}
```

## ActivationResponse

```protobuf
message ActivationResponse {
  Active active = 1;
  string replaced = 2;
}
```

## Summary

```protobuf
message Summary {
  string id = 1;
  uint32 rules = 2;
  uint32 running = 3;
  string published_by = 4;
  google.protobuf.Timestamp published_at = 5;
  string note = 6;
  bool active = 7;
}
```

## VersionList

```protobuf
message VersionList {
  repeated Summary versions = 1;
  Active active = 2;
}
```


## Source evidence

Generated from [`proto/seagull/ruleset/v1/ruleset.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/ruleset/v1/ruleset.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
