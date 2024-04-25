import {describe, expect, it} from 'vitest';
import {ProfileFormSchema} from '~/routes/_app.profile/profile-form';

describe('Profile Form Field Schema', () => {
  it('should validates the correct required form fields', () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '+61234578978',
      address: '1234 Main St, City, State, 12345',
    });
    expect(results.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoegmail.com',
      phoneNumber: '+61234578978',
      address: '1234 Main St, City, State, 12345',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'Invalid email',
    );
  });

  it('should reject invalid phone number', () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '+61234sdf578978',
      address: '1234 Main St, City, State, 12345',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'Invalid Phone Number',
    );
  });

  it('should required the new password if old password is provided', () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '+61234578978',
      address: '1234 Main St, City, State, 12345',
      oldPassword: 'oldpassword',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'New password is required',
    );
  });

  it('should required the old password if new password is provided', () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '+61234578978',
      address: '1234 Main St, City, State, 12345',
      password: 'Password123@',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'Old password is required',
    );
  });

  it('should required confirm password and match if new password is provided', () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '+61234578978',
      address: '1234 Main St, City, State, 12345',
      oldPassword: 'oldPassword',
      password: 'Password123@',
    });

    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      "Password don't match",
    );
  });

  it('should reject if new password is same as old password', () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '+61234578978',
      address: '1234 Main St, City, State, 12345',
      oldPassword: 'Password123@',
      password: 'Password123@',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'New password cannot be the same as the old password',
    );
  });

  it("should reject if password doesn't meet the password requirements", () => {
    const results = ProfileFormSchema.safeParse({
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phoneNumber: '+61234578978',
      address: '1234 Main St, City, State, 12345',
      oldPassword: 'Password123@@',
      password: 'password',
      confirmPassword: 'password',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'Password must be at least 8 characters, one capital letter, one number, and one special character',
    );
  });
});
