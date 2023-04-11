---
title: Build status notifications (preview)
---

> Build status notifications require an [Enterprise plan](https://www.apollographql.com/pricing/). They are currently in preview.

You can [configure Apollo Studio](./notification-setup) to notify your team via webhook whenever Apollo attempts to build a new supergraph schema for your [federated graph](/federation/). The notification indicates whether the build succeeded and provides a temporary URL to the new supergraph schema if so.

You can configure separate change notifications for each [variant](../../graphs/#variants) of your graph.

## Setup

See [Setting up Studio Notifications](./notification-setup).

## Webhook format

Build status notifications are sent exclusively as [webhooks](./notification-setup/#custom-webhooks-enterprise-only). Details are provided as a JSON object in the request body.

The JSON object conforms to the structure of the `ResponseShape` interface:

```javascript
interface BuildError {
  message: string;
  locations: ReadonlyArray<Location>;
}

interface Location {
  line: number;
  column: number;
}

interface ResponseShape {
  eventType: "BUILD_PUBLISH_EVENT";
  eventID: string;
  supergraphSchemaURL: string | undefined; // See description below
  buildSucceeded: boolean;
  buildErrors: BuildError[] | undefined; // See description below
  graphID: string;
  variantID: string; // See description below
  timestamp: string; // ISO 8601 Date string
}
```

- **If the build succeeds**, the value of `supergraphSchemaURL` is a short-lived (24-hour) URL that enables you to fetch the supergraph schema _without_ authenticating (such as with an API key). Otherwise, this field is not present.

- **If the build fails**, `buildErrors` is an array of `BuildError` objects that describe the errors that occurred during the build. Otherwise, this field is not present.

- The value of `variantID` is in the format `graphID@variantName` (e.g., `mygraph@staging`). This format is known as a [graph ref](/rover/conventions/#graph-refs).
