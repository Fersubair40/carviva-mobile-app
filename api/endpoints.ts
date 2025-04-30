const Endpoints = {
  auth: {
    login: '/api/v2/login/admins',
  },
  fuelTokens: {
    verify: '/api/v2/fuel-tokens/verify',
    dispense: '/api/v2/fuel-tokens/dispense',
  },
  buyFuel: {
    attendants: '/api/v2/attendants/buy-fuel',
  },
  user: {
    profile: '/api/v1/users',
  },
};

export default Endpoints;
