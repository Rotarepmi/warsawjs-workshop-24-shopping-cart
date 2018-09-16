import nock from "nock";
import paymentsApi from "../paymentsApi";

describe("paymentsApi", () => {
  const card = {
    "number": "4111111111111111",
    "securityCode": "950",
    "expMonth": "07",
    "expYear": "21",
    "owner": "John Doe"
  }
  const token = '123ABC';
  const amount = 2;

  it("authorizes the client", async () => {
    nock('http://payments.local')
      .post('/auth/token', { username: 'test', password: 'test' })
      .reply(200, {
        token: '123TOKEN'
      });

    const token = await paymentsApi.authorizeClient('test', 'test');

    expect(token).toBe('123TOKEN');
  });

  it("throws an error when credentials are wrong", () => {
    nock('http://payments.local')
      .post('/auth/token', { username: 'test_login', password: 'test_pass' })
      .reply(401);

    return paymentsApi.authorizeClient('test_login', 'test_pass')
      .catch(e => expect(e.message).toMatch('Unauthorized'));
  });

  it("processes card payment", async () => { 
    nock('http://payments.local')
      .post('/payments/payment', { token, amount: amount*100, card: card })
      .reply(200, {
        transactionId: 'transactionId'
      });

    const transactionId = await paymentsApi.processPayment(token, card, amount);
    expect(typeof transactionId).toEqual('string');
  });

  it("checks if transaction is completed", async () => {
    const id = 'transactionId';
    nock('http://payments.local')
      .get(`/payments/payment/${id}?token=${token}`)
      .reply(200, { "status": "COMPLETED" });
       
    const status = await paymentsApi.isPaymentCompleted(token, id)
    expect(status).toBeTruthy();
  });
});
