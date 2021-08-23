import { DeepExtend } from "./extend";

describe('DeepExtend', function() {

  it('should extend an empty object', function() {
    const obj1 = {};
    const obj2 = {one: 'one', two: 'two'};
    const result = DeepExtend(obj1, obj2);
  
    expect(result).toEqual(obj2);
    expect(obj1).toEqual(obj2);
  });

  it('should extend an existing object', function() {
    const obj1 = {zero: 'zero'};
    const obj2 = {one: 'one', two: 'two'};
    const result = DeepExtend(obj1, obj2);

    expect(result).toEqual({zero: 'zero', one: 'one', two: 'two'});
  });

  it('should overwrite obj1 values', function() {
    const obj1 = {zero: 'zero'};
    const obj2 = {one: 'one', two: 'two', zero: 'xero'};
    const result = DeepExtend(obj1, obj2);

    expect(result).toEqual({zero: 'xero', one: 'one', two: 'two'});
  });

  it('should overwrite deep obj1 values', function() {
    const obj1 = {zero: 'zero', deep: {foo: 'foo', bar: 'bar'}};
    const obj2 = {one: 'one', two: 'two', zero: 'xero', deep: {foo: 'bar'}};
    const result = DeepExtend(obj1, obj2);

    expect(result).toEqual({zero: 'xero', one: 'one', two: 'two', deep: {foo: 'bar', bar: 'bar'}});
  });
});
