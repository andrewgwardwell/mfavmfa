export const PATTERNS = {
    email: new RegExp("^([A-Za-z0-9.'_%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,3}?)"),
    emailRegister: new RegExp(
      "^([A-Za-z0-9.'_%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,3}?)"
    ),
    phone_number: new RegExp(
      '^(\\d{3}-?\\s?\\d{3}-?\\s?\\d{4}\\s?(x\\d{4})?)'
    ),
    fax: new RegExp('^(\\d{3}-?\\s?\\d{3}-?\\s?\\d{4}\\s?)'),
    alphanumeric: new RegExp('^\\w+$'),
    password: new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$'),
    passwordUpper: new RegExp('(?=.*[A-Z])'),
    passwordNumeric: new RegExp('(?=.*[0-9])'),
    passwordLower: new RegExp('(?=.*[a-z])'),
    passwordLength: new RegExp('^.{8,}$'),
    url: new RegExp(
      '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)*([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?'
    )
}
