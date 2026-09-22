---
title: "Inventory contract"
description: "Canonical seagull.inventory.v1 messages and field definitions."
---

This is the pinned `seagull.inventory.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## Kind

```protobuf
enum Kind {
  KIND_UNSPECIFIED = 0;
  KIND_OPERATING_SYSTEM = 1;
  KIND_KERNEL = 2;
  KIND_PACKAGE = 3;
  KIND_SERVICE = 4;
  KIND_NETWORK_INTERFACE = 5;
  KIND_USER = 6;
  KIND_HARDWARE = 7;
  KIND_PROCESS = 8;
}
```

## Mode

```protobuf
enum Mode {
  MODE_UNSPECIFIED = 0;
  MODE_SNAPSHOT = 1;
  MODE_DELTA = 2;
}
```

## OperatingSystem

```protobuf
message OperatingSystem {
  string name = 1;
  string version = 2;
  string build = 3;

  // The vendor's own identifier for the distribution, such as `ubuntu` or
  // `rhel`, which is what a vulnerability feed is keyed by and what the display
  // name cannot be relied on to give.
  string platform = 4;

  string codename = 5;
  string family = 6;
}
```

## Kernel

```protobuf
message Kernel {
  string name = 1;
  string release = 2;
  string version = 3;
  string architecture = 4;
}
```

## Package

```protobuf
message Package {
  string name = 1;
  string version = 2;
  string architecture = 3;
  string manager = 4;
  string source = 5;
  string vendor = 6;
  uint64 size_bytes = 7;
  google.protobuf.Timestamp installed_at = 8;
}
```

## Service

```protobuf
message Service {
  enum State {
    STATE_UNSPECIFIED = 0;
    STATE_RUNNING = 1;
    STATE_STOPPED = 2;
    STATE_FAILED = 3;
  }

  string name = 1;
  string display_name = 2;
  State state = 3;

  // The init system's own word for whether it starts on boot — `enabled`,
  // `disabled`, `manual`, `static`. Left as text because the set is the vendor's
  // and a value nobody declared is worth keeping rather than refusing.
  string start_mode = 4;

  string path = 5;
}
```

## NetworkInterface

```protobuf
message NetworkInterface {
  enum State {
    STATE_UNSPECIFIED = 0;
    STATE_UP = 1;
    STATE_DOWN = 2;
  }

  string name = 1;
  string mac = 2;
  repeated string addresses = 3;
  State state = 4;
  uint32 mtu = 5;
  string type = 6;
}
```

## User

```protobuf
message User {
  string name = 1;
  string uid = 2;
  string gid = 3;
  string home = 4;
  string shell = 5;
  repeated string groups = 6;
  google.protobuf.Timestamp last_login = 7;
}
```

## Hardware

```protobuf
message Hardware {
  string cpu_name = 1;
  uint32 cpu_cores = 2;
  uint32 cpu_mhz = 3;
  uint64 memory_total_bytes = 4;
  string serial = 5;
  string vendor = 6;
  string model = 7;
}
```

## Process

```protobuf
message Process {
  uint32 pid = 1;
  uint32 parent_pid = 2;
  string name = 3;
  string path = 4;
  string command_line = 5;
  string user = 6;
  google.protobuf.Timestamp started_at = 7;
}
```

## Item

```protobuf
message Item {
  oneof body {
    OperatingSystem operating_system = 16;
    Kernel kernel = 17;
    Package package = 18;
    Service service = 19;
    NetworkInterface network_interface = 20;
    User user = 21;
    Hardware hardware = 22;
    Process process = 23;
  }
}
```

## Record

```protobuf
message Record {
  string record_id = 1;
  uint32 schema_version = 2;

  Kind kind = 3;
  Mode mode = 4;

  // When the collector looked, which is what decides whether this record is
  // newer than what the projection already holds. It is the producer's clock and
  // is bounded by the same admission window an event's timestamps are.
  google.protobuf.Timestamp collected_at = 5;

  seagull.event.v1.Origin origin = 6;
  seagull.event.v1.Collection collection = 7;
  seagull.event.v1.Reception reception = 8;

  repeated Item items = 9;
}
```

## RecordBatch

```protobuf
message RecordBatch {
  string batch_id = 1;
  uint32 protocol_version = 2;
  repeated Record records = 3;
}
```


## Source evidence

Generated from [`proto/seagull/inventory/v1/inventory.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/inventory/v1/inventory.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
