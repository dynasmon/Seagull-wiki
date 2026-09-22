---
title: "Control contract"
description: "Canonical seagull.control.v1 messages and field definitions."
---

This is the pinned `seagull.control.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## Resource

```protobuf
enum Resource {
  RESOURCE_UNSPECIFIED = 0;
  RESOURCE_EVENTS = 1;
  RESOURCE_DETECTIONS = 2;
  RESOURCE_RULESETS = 3;
  RESOURCE_ALERTS = 4;
  RESOURCE_AGENTS = 5;
  RESOURCE_POLICIES = 6;
  RESOURCE_SESSIONS = 7;
  RESOURCE_INCIDENTS = 8;
}
```

## Action

```protobuf
enum Action {
  ACTION_UNSPECIFIED = 0;
  ACTION_READ = 1;
  ACTION_WRITE = 2;
  ACTION_DELETE = 3;
}
```

## Permission

```protobuf
message Permission {
  Resource resource = 1;
  Action action = 2;
}
```

## Grant

```protobuf
message Grant {
  string subject = 1;
  repeated string tenants = 2;
  repeated string roles = 3;
  repeated Permission permissions = 4;
}
```

## Session

```protobuf
message Session {
  string id = 1;
  google.protobuf.Timestamp issued_at = 2;
  google.protobuf.Timestamp expires_at = 3;
  Grant grant = 4;
}
```

## SessionList

```protobuf
message SessionList {
  repeated Session sessions = 1;
}
```

## SessionRequest

```protobuf
message SessionRequest {
  google.protobuf.Duration requested_lifetime = 1;
}
```

## SessionResponse

```protobuf
message SessionResponse {
  string token = 1;
  Session session = 2;
}
```

## RevocationRequest

```protobuf
message RevocationRequest {
  string session_id = 1;
}
```

## RevocationResponse

```protobuf
message RevocationResponse {
  uint32 revoked = 1;
}
```

## Refusal

```protobuf
message Refusal {
  string code = 1;
  string detail = 2;
}
```


## Source evidence

Generated from [`proto/seagull/control/v1/access.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/control/v1/access.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
