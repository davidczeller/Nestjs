import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // hash() should hash the password.
  // plaintext => hash
  // same input => same output
  // 12345678 => $2b$10$...
  // ==========================
  // bcrypt.hash() => was called
  //               => password was passed to it & salt
  // mocks & spies
  // mocks are objects that can be used to replace the real objects (bcrypt.hash())
  // spies are mocks that can be used to track the calls to the function (bcrypt.hash())

  it('should hash the password', async () => {
    // Since we mock, the actual bcrypt.hash() will not be called
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

    const password = 'password123';
    const result = await service.hash(password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should verify the password', async () => {
    // Mock the bcrypt.compare() to return true
    // mock the resolved value to true
    // call the service method with the password and the hashed password - verify()
    // bcrypt.compare - was called with specific arguments
    // we verify if the service method returned what bcrypt.compare returned
    const mockCompare = true;
    (bcrypt.compare as jest.Mock).mockResolvedValue(mockCompare);

    const password = 'password123';
    const hashedPassword = 'hashed_password';
    const result = await service.verify(password, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(mockCompare);
  });
});
