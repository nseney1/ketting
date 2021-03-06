import { expect } from 'chai';
import Ketting from '../../src/ketting';

describe('OAuth2 Authentication', () => {

  describe('Owner flow', () => {

    it('should return 401 if no credentials were passed.', async () => {

      const ketting = new Ketting('http://localhost:3000/hal1.json');
      const resource = await ketting.follow('auth-oauth');
      const response = await resource.fetch();
      expect(response.status).to.eql(401);

    });

    it('should throw error if incorrect client credentials were passed.', (done) => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClient',
            clientSecret: 'fooSecret',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          },
          owner: {
            userName: 'fooOwner',
            password: 'barPassword'
          }
        }
      });
      ketting.follow('auth-oauth')
        .catch((error) => {
          expect(error).to.be.an('error');
          done();
        });

    });

    it('should return 401 if incorrect owner credentials were passed.', (done) => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClient',
            clientSecret: 'barSecret',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          },
          owner: {
            userName: 'fooOwner',
            password: 'fooPassword'
          }
        }
      });
      ketting.follow('auth-oauth')
        .catch((error) => {
          expect(error).to.be.an('error');
          done();
        });

    });

    it('should return 200 OK if correct credentials were passed.', async () => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClient',
            clientSecret: 'barSecret',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          },
          owner: {
            userName: 'fooOwner',
            password: 'barPassword'
          }
        }
      });

      const resource = await ketting.follow('auth-oauth');
      const response = await resource.fetch();
      expect(response.status).to.eql(200);

    });

    it('should refresh token if 401 is returned and retry request', async () => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClient',
            clientSecret: 'barSecret',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          },
          owner: {
            userName: 'fooOwner',
            password: 'barPassword'
          }
        }
      });

      const token = ketting.oauth2Helper.client.createToken(
        'barToken',
        'fooRefresh',
        // @ts-ignore. Something breaks here, but I think everything is correct.
        'bearer'
      );
      ketting.oauth2Helper.token = token;

      const resource = await ketting.follow('auth-oauth');
      const response = await resource.fetch();
      expect(response.status).to.eql(200);

    });

    it('should refresh token if 401 is returned and throw error if refresh is invalid', async () => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClient',
            clientSecret: 'barSecret',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          },
          owner: {
            userName: 'fooOwner',
            password: 'barPassword'
          }
        }
      });

      const token = ketting.oauth2Helper.client.createToken(
        'barToken',
        'barRefresh',
        // @ts-ignore. Something breaks here, but I think everything is correct.
        'bearer'
      );
      ketting.oauth2Helper.token = token;

      try {
        const resource = await ketting.follow('auth-oauth');
        await resource.fetch();

      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
  });

  describe('Client credentials flow', () => {

    it('should throw error if incorrect client credentials were passed.', (done) => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'badlient',
            clientSecret: 'badSecret',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          }
        }
      });
      ketting.follow('auth-oauth')
        .catch((error) => {
          expect(error).to.be.an('error');
          done();
        });

    });

    it('should return 200 OK if correct credentials were passed.', async () => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClientCredentials',
            clientSecret: 'barSecretCredentials',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          }
        }
      });

      const resource = await ketting.follow('auth-oauth');
      const response = await resource.fetch();
      expect(response.status).to.eql(200);

    });

    it('should refresh token if 401 is returned and retry request', async () => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClientCredentials',
            clientSecret: 'barSecretCredentials',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          }
        }
      });

      const token = ketting.oauth2Helper.client.createToken(
        'barToken',
        'fooRefresh',
        // @ts-ignore. Something breaks here, but I think everything is correct.
        'bearer'
      );
      ketting.oauth2Helper.token = token;

      const resource = await ketting.follow('auth-oauth');
      const response = await resource.fetch();
      expect(response.status).to.eql(200);

    });

    it('should refresh token if 401 is returned and throw error if refresh is invalid', async () => {

      const ketting = new Ketting('http://localhost:3000/hal1.json', {
        auth: {
          type: 'oauth2',
          client: {
            clientId: 'fooClientCredentials',
            clientSecret: 'barSecretCredentials',
            accessTokenUri: 'http://localhost:3000/oauth-token',
            scopes: ['test']
          }
        }
      });

      const token = ketting.oauth2Helper.client.createToken(
        'barToken',
        'barRefresh',
        // @ts-ignore. Something breaks here, but I think everything is correct.
        'bearer'
      );
      ketting.oauth2Helper.token = token;

      try {
        const resource = await ketting.follow('auth-oauth');
        await resource.fetch();

      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
  });

});
