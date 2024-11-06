class BrevoRequest {
  constructor(template, receivers) {
    this.template = template;
    this.receivers = receivers;
  }

  toJSON() {
    return {
      to: this.receivers.map(receiver => ({ email: receiver })),
      templateId: this.template.template(),
      params: this.template.params(),
      sender:{ name: "Smart Teach Academy", email: "smartteachacademy@gmail.com" },
      subject: "Welcome to Smart Teach Academy",
    };
  }
}

module.exports = BrevoRequest;
