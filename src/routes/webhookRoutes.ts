import { Router } from "express";
import elementorWebhookController from "../controller/webhooks/elementorWebhookController.js";
import ploomesWebhookController from "../controller/webhooks/ploomesWebhookController.js";

const router = Router();

router.post("/webhook/elementor", elementorWebhookController.processElementorWebhook);
router.post("/webhook/ploomes", ploomesWebhookController.processPloomesWebhook)

export default router