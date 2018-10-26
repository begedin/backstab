const wait = subject => ({ type: 'WAIT', outcome: { subject } });

export default wait;
