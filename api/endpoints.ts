const Endpoints = {
  auth: {
    login: '/api/v2/login/admins',
  },
  fuelTokens: {
    verify: '/api/v2/fuel-tokens/verify',
    dispense: '/api/v2/fuel-tokens/dispense',
  },
  buyFuel: {
    attendants: '/api/v2/payments/attendants/buy-fuel',
  },
  user: {
    profile: '/api/v1/users',
  },
  report: {
    root: '/api/v2/reports',
    metrics: '/api/v2/reports/metrics',
  },
};

export default Endpoints;
