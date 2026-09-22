---
title: "Platform contract"
description: "Canonical seagull.platform.v1 messages and field definitions."
---

This is the pinned `seagull.platform.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## VersionRange

```protobuf
message VersionRange {
  uint32 minimum = 1;
  uint32 maximum = 2;
}
```

## Descriptor

```protobuf
message Descriptor {
  uint32 protocol_version = 1;
  VersionRange supported_protocol = 2;
  uint32 event_schema_version = 3;
  VersionRange supported_event_schema = 4;
  google.protobuf.Timestamp server_time = 5;
}
```


## Source evidence

Generated from [`proto/seagull/platform/v1/descriptor.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/platform/v1/descriptor.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
