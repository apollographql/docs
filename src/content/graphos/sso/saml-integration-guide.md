---
title: SAML Integration Guide
---

This guide walks through configuring a SAML identity provider (IdP) for GraphOS Studio.  You will need administrative access to your SSO Identity Provider (IdP).

1. Create a new application in your SSO environment:
   * Set **App Name**:  `Apollo GraphOS Studio` 
   * Set **App logo**: [Apollo logo](../img/sso/apollo-sk-logo.png) (optional) 
   * If possible, upload Apollo's SAML metadata:
     * If the Entity ID of `PingConnect` **has not** been used: [apollo_studio_pingconnect_metadata.xml](apollo_studio_pingconnect_metadata.xml)
     * If the Entity ID of `PingConnect` **has** been used: [apollo_studio_guid_metadata.xml](apollo_studio_guid_metadata.xml)
     > ⚠️  If you require Authn requests to be signed please inform your Apollo contact.  They will provide a separate metadata file.
   * Validate/set **Single Sign on URL** _or_ **ACS URL**: `https://sso.connect.pingidentity.com/sso/sp/ACS.saml2`.  This value may also be used for the following fields:  
     * **Recipient**
     * **ACS (Consumer) URL Validator**
     * **ACS (Consumer) URL**
   * Validate/set **Entity ID**:
     * If `PingConnect` **has not** been used, use it.
     * If `PingConnect` **has** been used, use `fd76e619-6c0a-461c-912d-418278929d60`.
   * Validate/set **RelayState**: `https://pingone.com/1.0/fd76e619-6c0a-461c-912d-418278929d60`
   * Validate/set user attributes:
     * **sub**: Uniquely identifies the user to Apollo Studio. Typically email.
     * **email**
     * **given_name**
     * **family_name**

2. Assign users to Apollo GraphOS Studio application  
   > ⚠️ Make sure to assign users to the newly created `Apollo GraphOS Studio` application for testing.

3. Send your Apollo contact one of the following:
   * Identity provider (IdP) SAML XML metadata file (preferred)
   * In lieu of an IdP SAML XML metadata file, the following:
     * IdP entity ID
     * IdP single sign-on URL / SSO URL
     * IdP x509 certificate
