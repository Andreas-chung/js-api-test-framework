import {login} from "../api/Login";
import {expect} from '../index'

describe('Login functionality',  () => {

    it('A user is able to successfully login when the correct credentials are used', async () => {
       let res = await login('eve.holt@reqres.in', 'cityslicka');
       expect(res.data).to.not.be.null;
    });

});