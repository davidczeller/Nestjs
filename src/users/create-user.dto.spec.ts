import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  // beforeEach runs before each test beforeAll runs before all tests once

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.name = 'Test';
    dto.password = 'Test123!'; // Valid: has uppercase, lowercase, number, and special char from allowed set
  });

  it('should validate complete valid data', async () => {
    // Arrange
    // Done in beforeEach

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    // Arrange
    dto.email = 'test@test';
    // Rest is done in beforeEach

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0]?.constraints).toHaveProperty('isEmail');
  });

  it('should fail on empty name', async () => {
    dto.name = '';
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0]?.constraints).toHaveProperty('minLength');
    expect(errors[0]?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail on name shorter than 3 characters', async () => {
    dto.name = 'ab'; // Less than 3 characters but not empty

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0]?.constraints).toHaveProperty('minLength');
    expect(errors[0]?.constraints).not.toHaveProperty('isString');
    expect(errors[0]?.constraints).not.toHaveProperty('isNotEmpty');
    expect(typeof dto.name).toBe('string');
  });

  describe('password validation', () => {
    const expectPasswordError = async (
      password: string,
      expectedConstraints: string[],
    ) => {
      dto.password = password;
      const errors = await validate(dto);
      const passwordError = errors.find((e) => e.property === 'password');

      expect(passwordError).toBeDefined();
      expectedConstraints.forEach((constraint) => {
        expect(passwordError?.constraints).toHaveProperty(constraint);
      });
    };

    it('fails when empty', async () => {
      await expectPasswordError('', ['isNotEmpty', 'minLength']);
    });

    it('fails when shorter than 6 characters', async () => {
      await expectPasswordError('Test1', ['minLength', 'matches']);
    });

    it('fails when missing uppercase, number, or special character', async () => {
      await expectPasswordError('password', ['matches']); // Test will pass
      // await expectPasswordError('passworD2!', ['matches']); // Test will fail
    });
  });
});
