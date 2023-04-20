---
title: Setting up Apollo SSO with a SAML-based IdP
---

> ⚠️ Single sign-on (SSO) is available only for [Enterprise plans](https://www.apollographql.com/pricing/).

This guide walks through configuring a generic SAML-based identity provider (IdP) for use with Apollo single sign-on (SSO). These steps require administrative access to your IdP.

<blockquote>

**If you use Okta or Azure Active Directory as your identity provider**, instead see the corresponding guide for your tool:

- [Okta](./okta-integration-guide/)
- [Azure AD](./azure-ad-integration-guide/)

</blockquote>

1. Create a new application in your SSO environment. While doing so, set the following values:

    * **App Name**:  `Apollo GraphOS` 
    * **App logo**: [Apollo logo](../img/sso/apollo-sk-logo.png) (optional) 

2. If possible, upload the appropriate Apollo SAML metadata for your organization:
    * If your organization **does not** already use the Entity ID `PingConnect`: [apollo_studio_pingconnect_metadata.xml](apollo_studio_pingconnect_metadata.xml)
        * If Authn requests need to be signed use: [apollo_studio_pingconnect_signed_metadata.xml](apollo_studio_pingconnect_signed_metadata.xml)
    * If your organization **does** already use `PingConnect`: [apollo_studio_guid_metadata.xml](apollo_studio_guid_metadata.xml)
        * If Authn requests need to be signed use: [apollo_studio_guid_signed_metadata.xml](apollo_studio_guid_signed_metadata.xml)     

3. Set your **Single Sign on URL** _or_ **ACS URL** to the following: 

    `https://sso.connect.pingidentity.com/sso/sp/ACS.saml2`
    
    You can also use this value for the following fields:

    * **Recipient**
    * **ACS (Consumer) URL Validator**
    * **ACS (Consumer) URL**

4. Set your **Entity ID** according to the following:
    * If your organization **does not** already use `PingConnect` as an Entity ID, use `PingConnect`.
    * If your organization **does** already use `PingConnect`, use the following value:
        
        `fd76e619-6c0a-461c-912d-418278929d60`

5. Set your **RelayState** to the following value:
    
    `https://pingone.com/1.0/fd76e619-6c0a-461c-912d-418278929d60`

6. Set the following user attributes:
    - **sub**: `user.email`
      - The **sub** attribute should uniquely identify any particular user to GraphOS. In most cases, `user.email` provides this unique mapping.
    - **email**: `user.email`
    - **given_name**: `user.firstName`
    - **family_name**: `user.lastName`

7. Assign users to the Apollo GraphOS application.
    - Reach out to your SSO or Identity & Access Management team for help assigning the relevant groups and users to `Apollo GraphOS`.

8. Send your Apollo contact your identity provider (IdP) SAML XML metadata file.
    
    **If you can't send this file,** send one of the following instead:

    - IdP entity ID
    - IdP single sign-on URL / SSO URL
    - IdP x509 certificate

9. Your Apollo contact will complete your SSO setup.
