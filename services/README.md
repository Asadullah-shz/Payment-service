### 🌐 API Endpoints & RPC Events

<details>
<summary><b>Auth Service</b></summary>

- `POST /register`
- `POST /login`
- `POST /logout`
- `PUT /update-role`
</details>

<details>
<summary><b>Payment Service</b></summary>

- `POST /create`
- `POST /cancel`
- `GET /record`
- `GET /record/:id`
- `GET /status/:id`
- `POST /update/:paymentIntentId`
- `POST /refund`

**Published Events:** `payment.created`, `payment.cancelled`, `refund.created`
</details>

<details>
<summary><b>Merchant Service</b></summary>

- `POST /register`
- `POST /me`
- `POST /update`
- `GET /:id`

**RPC Responders:** `rpc_merchant_get`
</details>

<details>
<summary><b>Stripe Service</b></summary>

- `POST /config`
- `POST /update`
- `GET /getconfig/:merchantId`
- `POST /refund`

**RPC Responders:** `rpc_stripe_config_get`
</details>

<details>
<summary><b>Subscription Service</b></summary>

- `POST /subscriptions`
- `GET /subscriptions`
- `GET /subscriptions/:id`
- `PATCH /subscriptions/:id`
- `POST /subscriptions/:id/pause`
- `POST /subscriptions/:id/resume`
- `POST /subscriptions/:id/cancel`

**Published Events:** `subscription.created`, `subscription.paused`, `subscription.resumed`, `subscription.cancelled`
</details>

<details>
<summary><b>Refund Service</b></summary>

- `POST /create`
- `POST /refund/:paymentId`
- `GET /refunds`
- `GET /refunds/:id`

**Published Events:** `refund.succeeded`
**RPC Responders:** `rpc_refund_create`
</details>

<details>
<summary><b>Payout Service</b></summary>

- `POST /payouts`
- `GET /payouts`
- `GET /payouts/:id`
- `POST /payouts/:id/cancel`

**Published Events:** `payout.created`, `payout.cancelled`
</details>

<details>
<summary><b>Transaction Service</b></summary>

- `POST /create`
- `GET /transactions`
- `GET /transactions/:id`
</details>

<details>
<summary><b>Incoming Webhook Service</b></summary>

- `POST /`
</details>

<details>
<summary><b>Merchant Webhook Service</b></summary>

- `POST /`
- `GET /`
- `PATCH /:id`
- `DELETE /:id`
- `POST /:id/test`
</details>

<details>
<summary><b>Gateway Router Service</b></summary>

**RPC Responders:** `rpc_gateway_route`
</details>

---

