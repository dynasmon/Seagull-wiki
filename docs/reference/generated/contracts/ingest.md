---
title: "Ingest contract"
description: "Canonical seagull.ingest.v1 messages and field definitions."
---

This is the pinned `seagull.ingest.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## EventBatch

```protobuf
message EventBatch {
  string batch_id = 1;
  uint32 protocol_version = 2;
  repeated seagull.event.v1.Event events = 3;
}
```

## BatchAck

```protobuf
message BatchAck {
  bool accepted = 1;
  bool durable = 2;
  uint32 received = 3;
}
```

## Rejection

```protobuf
message Rejection {
  string code = 1;
  string detail = 2;
  string field = 3;

  // Which record of the batch was refused, or -1 when the batch was refused as
  // a whole. It indexes whatever the batch carried: the name predates inventory
  // records, which are refused with this same message, and renaming a field a
  // deployed agent already reads would strand it for nothing.
  int32 event_index = 4;
}
```


## Source evidence

Generated from [`proto/seagull/ingest/v1/ingest.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/ingest/v1/ingest.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
