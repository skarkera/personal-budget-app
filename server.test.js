const server =require('./server');

test('field is filled',() => {
    //expect('').calledImmediatelyBefore();
    expect('username').not.toEqual(null);
    expect('password').not.toEqual(null);
})