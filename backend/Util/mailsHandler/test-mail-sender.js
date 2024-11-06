


// const OnboardingTemplate = require("./mailTemplets/OnboardingTemplate");
const brevoConfig = require("./brevo/brevoConfig");
const BrevoService = require("./brevo/brevoService");

const brevoService = new BrevoService(brevoConfig);
// const template = new OnboardingTemplate('JohnDoe', 'https://axgr.dev');
brevoService.send(template, 'mohamed.smenshawy@gmail.com');
