import { Router } from "express";
import elementorWebhookController from "../controller/webhooks/elementor-webhook-controller.js";
import ploomesWebhookController from "../controller/webhooks/ploomes-webhook-controller.js";

const router = Router();

router.post("/webhook/elementor", elementorWebhookController.processElementorWebhook);
router.post("/webhook/ploomes", ploomesWebhookController.processPloomesWebhook)

export default router