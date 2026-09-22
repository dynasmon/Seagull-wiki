---
title: "Agent contract"
description: "Canonical seagull.agent.v1 messages and field definitions."
---

This is the pinned `seagull.agent.v1` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).

## State

```protobuf
enum State {
  STATE_UNSPECIFIED = 0;

  // Registered, with no certificate identity bound to it yet.
  STATE_PENDING = 1;

  // A certificate identity is bound and telemetry from it is admitted.
  STATE_ACTIVE = 2;

  STATE_DISABLED = 3;
  STATE_REVOKED = 4;
  STATE_DECOMMISSIONED = 5;
}
```

## Identity

```protobuf
message Identity {
  string subject = 1;
  string serial = 2;
  string fingerprint_sha256 = 3;
  google.protobuf.Timestamp issued_at = 4;
  google.protobuf.Timestamp expires_at = 5;
}
```

## Platform

```protobuf
message Platform {
  string os = 1;
  string architecture = 2;
  string hostname = 3;
}
```

## Agent

```protobuf
message Agent {
  string agent_id = 1;
  uint32 schema_version = 2;
  string tenant_id = 3;

  State state = 4;
  Platform platform = 5;
  string agent_version = 6;
  Identity identity = 7;

  // When the platform first knew of this agent, which is when somebody
  // registered it.
  google.protobuf.Timestamp registered_at = 8;

  // Who last moved it and when. The whole trail is a separate read: this is the
  // last line of it, carried so a list does not need one query per row.
  string changed_by = 9;
  google.protobuf.Timestamp changed_at = 10;

  // Moves by one on every transition, and a caller may say which revision it
  // believed it was acting on. Two operators acting at once means the second is
  // told the agent moved rather than quietly overwriting the first.
  uint64 revision = 11;

  // When telemetry from this agent last reached the platform. It is not stored
  // beside the fields above and is not part of what the registry decides: it is
  // read back from where the telemetry landed, so a registry that has never
  // heard from an agent cannot claim it is alive and a busy agent cannot cost a
  // write on the ingest path to say so. Absent when nothing was found.
  google.protobuf.Timestamp last_seen = 12;
}
```

## Transition

```protobuf
message Transition {
  string agent_id = 1;
  uint64 revision = 2;
  State from = 3;
  State to = 4;
  string actor = 5;
  google.protobuf.Timestamp at = 6;
  string note = 7;
}
```

## History

```protobuf
message History {
  string agent_id = 1;
  repeated Transition transitions = 2;
}
```

## Registration

```protobuf
message Registration {
  string agent_id = 1;
  string tenant_id = 2;
  Platform platform = 3;
  string agent_version = 4;
  string note = 5;
}
```

## BindingRequest

```protobuf
message BindingRequest {
  Identity identity = 1;
  string note = 2;

  // Zero acts on whatever the agent currently is. Otherwise the revision the
  // caller believed it was acting on, and a mismatch is refused.
  uint64 expected_revision = 3;
}
```

## TransitionRequest

```protobuf
message TransitionRequest {
  State to = 1;

  // Required for every ending. Disabling, revoking and decommissioning are all
  // acts somebody has to answer for, and none of them is worth recording
  // without the why.
  string note = 2;

  uint64 expected_revision = 3;
}
```

## Query

```protobuf
message Query {
  // Over registered_at, and optional: an agent list is small enough to answer
  // without one, which a telemetry hunt is not.
  seagull.hunt.v1.TimeRange range = 1;

  repeated State states = 2;

  // Zero asks for the server's default. The server caps it either way.
  uint32 limit = 3;

  // Empty asks for the first page. Otherwise the `next_cursor` of the page
  // before it, unchanged: it is the server's own token and is not composed by a
  // caller.
  string cursor = 4;
}
```

## Page

```protobuf
message Page {
  repeated Agent agents = 1;
  string next_cursor = 2;
}
```

## Admission

```protobuf
message Admission {
  string agent_id = 1;
  string tenant_id = 2;
  State state = 3;

  // The registry revision this record was written from, so a record that arrives
  // out of order is recognised as older rather than applied over a newer one.
  uint64 revision = 4;
  google.protobuf.Timestamp changed_at = 5;
}
```

## CertificateRequest

```protobuf
message CertificateRequest {
  // PEM-encoded PKCS#10. Its common name is the agent it is for, and one naming
  // anybody else is refused rather than signed under a corrected name — the
  // subject is what the gateway reads an identity from.
  bytes csr_pem = 1;

  string note = 2;

  // Zero acts on whatever the agent currently is. Otherwise the revision the
  // caller believed it was acting on: issuing binds what it signed, so it moves
  // the agent and races with every other move.
  uint64 expected_revision = 3;
}
```

## RenewalRequest

```protobuf
message RenewalRequest {
  bytes csr_pem = 1;
}
```

## IssuedCertificate

```protobuf
message IssuedCertificate {
  bytes certificate_pem = 1;

  // The authority that signed it, and any above it, so the agent presents a
  // chain a listener verifies without holding an intermediate of its own.
  bytes chain_pem = 2;

  // Every authority the agent trusts when it verifies a Seagull listener. Sent
  // on every issuance rather than only when it changes, because that is what
  // rotates a certificate authority without an operator visiting each machine:
  // an agent that renews learns the next authority before the current one stops
  // signing.
  bytes trust_bundle_pem = 3;

  // What the registry recorded, so neither side has to parse the other's
  // certificate to agree on the identity that was bound.
  Identity identity = 4;
}
```

## CertificateRecord

```protobuf
message CertificateRecord {
  string agent_id = 1;
  Identity identity = 2;

  // The subject of the authority that signed it, so rotating a certificate
  // authority is visible in the trail and not only in the configuration.
  string authority_subject = 3;

  // Who asked for it: the operator who had it signed, or the agent's own
  // identifier when it renewed with the certificate it was replacing. An
  // operator was involved exactly when this is not the agent.
  string issued_by = 4;

  // When it stopped being the agent's current certificate. Absent while it is.
  google.protobuf.Timestamp superseded_at = 5;
}
```

## CertificateHistory

```protobuf
message CertificateHistory {
  string agent_id = 1;
  repeated CertificateRecord certificates = 2;
}
```


## Source evidence

Generated from [`proto/seagull/agent/v1/agent.proto`](https://github.com/dynasmon/Seagull-contracts/blob/d2090c560f54ee80990d1188c0d8fd0408a1e1d5/proto/seagull/agent/v1/agent.proto) at `d2090c5`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
