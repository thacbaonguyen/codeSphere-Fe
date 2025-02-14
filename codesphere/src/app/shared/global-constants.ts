export class GlobalConstants{
  // message
  public static generateError: string = 'Something went wrong. Please try again later!';

  //regex

  public static nameRegex: string = '[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪửữứựỳỵỷỹý ]*';
  public static usernameRegex = '^[a-zA-Z0-9_]+$';
  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  public static phoneNumberRegex: string = '^[0-9]{10,10}$';

  // variable
  public static error: string = 'error';

  public static unauthorized: string = "Bạn không có quyền truy cập mục này!";
}
