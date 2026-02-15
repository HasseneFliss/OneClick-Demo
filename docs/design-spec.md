# Design Specification

{
  "designTokens": {
    "colors": {
      "error": "#ef4444",
      "primary": "#6366f1",
      "success": "#22c55e",
      "warning": "#f59e0b"
    },
    "spacing": {
      "lg": "24px",
      "md": "16px",
      "sm": "8px",
      "xl": "32px",
      "xs": "4px"
    },
    "borderRadius": {
      "lg": "12px",
      "md": "8px",
      "sm": "4px",
      "full": "9999px"
    }
  },
  "figmaDesigns": {
    "loginPage": {
      "layout": "Centered card with logo, form inputs, and social login options below",
      "components": [
        "EmailInput",
        "PasswordInput",
        "RememberMeCheckbox",
        "LoginButton",
        "SocialLoginButtons",
        "ForgotPasswordLink"
      ]
    },
    "adminRoles": {
      "layout": "Data table with expandable permission details",
      "components": [
        "RoleTable",
        "PermissionMatrix",
        "CreateRoleModal",
        "AssignRoleModal"
      ]
    },
    "mfaSetupPage": {
      "layout": "Step-by-step MFA setup with authenticator app instructions",
      "components": [
        "QRCodeDisplay",
        "SecretKeyText",
        "VerificationInput",
        "BackupCodesDisplay",
        "ConfirmButton"
      ]
    },
    "registerPage": {
      "layout": "Multi-step wizard: 1. Email, 2. Password, 3. Verification",
      "components": [
        "EmailInput",
        "PasswordInput",
        "ConfirmPasswordInput",
        "PasswordStrengthMeter",
        "TermsCheckbox",
        "RegisterButton"
      ]
    },
    "sessionManagement": {
      "layout": "List view with device icons, location info, and action buttons",
      "components": [
        "SessionList",
        "SessionCard",
        "RevokeButton",
        "LogoutAllButton"
      ]
    }
  }
}