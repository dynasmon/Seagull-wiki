---
title: "Event contract"
description: "Canonical seagull.event.v1 messages and field definitions."
---

This is the pinned `seagull.event.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## EventClass

```protobuf
enum EventClass {
  EVENT_CLASS_UNSPECIFIED = 0;
  EVENT_CLASS_AUTHENTICATION = 1;
}
```

## Outcome

```protobuf
enum Outcome {
  OUTCOME_UNSPECIFIED = 0;
  OUTCOME_SUCCESS = 1;
  OUTCOME_FAILURE = 2;
}
```

## Transport

```protobuf
enum Transport {
  TRANSPORT_UNSPECIFIED = 0;
  TRANSPORT_TCP = 1;
  TRANSPORT_UDP = 2;
}
```

## Timestamps

```protobuf
message Timestamps {
  google.protobuf.Timestamp event_time = 1;
  google.protobuf.Timestamp observed_time = 2;
}
```

## Reception

```protobuf
message Reception {
  google.protobuf.Timestamp ingest_time = 1;
  string gateway = 2;
  string batch_id = 3;
}
```

## Host

```protobuf
message Host {
  string hostname = 1;
  string ip = 2;
  string os = 3;
  string architecture = 4;
}
```

## Origin

```protobuf
message Origin {
  string tenant_id = 1;
  string agent_id = 2;
  Host host = 3;
}
```

## Collection

```protobuf
message Collection {
  string collector = 1;
  string source = 2;
  uint64 sequence = 3;
}
```

## User

```protobuf
message User {
  string name = 1;
  string domain = 2;
  string uid = 3;
}
```

## Endpoint

```protobuf
message Endpoint {
  string ip = 1;
  uint32 port = 2;
}
```

## Network

```protobuf
message Network {
  Endpoint source = 1;
  Endpoint destination = 2;
  Transport transport = 3;
}
```

## Service

```protobuf
message Service {
  string name = 1;
  string protocol = 2;
}
```

## Authentication

```protobuf
message Authentication {
  enum Activity {
    ACTIVITY_UNSPECIFIED = 0;
    ACTIVITY_LOGON = 1;
    ACTIVITY_LOGOFF = 2;
  }

  Activity activity = 1;
  Outcome outcome = 2;
  string outcome_reason = 3;
  string method = 4;
  User user = 5;
  Service service = 6;
  Network network = 7;
  string raw_record = 15;
}
```

## Event

```protobuf
message Event {
  string event_id = 1;
  uint32 schema_version = 2;
  EventClass event_class = 3;
  Timestamps time = 4;
  Origin origin = 5;
  Collection collection = 6;
  Reception reception = 7;

  oneof body {
    Authentication authentication = 16;
  }
}
```


## Source evidence

Generated from [`proto/seagull/event/v1/event.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/event/v1/event.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
