import { RegexValidation } from "./regex.validation";

describe('Regex Util', () => {

  it('should validate valid uuid with true', () => {
    const validUUID = '1ec30bac-cdd3-46ed-b70a-12418210705b';
    expect(RegexValidation.isValidUUID(validUUID)).toBeTruthy();
  });

  it('should validate invalid uuid with false', () => {
    const invalidUUID = '1ec30bac-cdd3-46ed-b70a-1241821070';
    expect(RegexValidation.isValidUUID(invalidUUID)).toBeFalsy();
  });


})