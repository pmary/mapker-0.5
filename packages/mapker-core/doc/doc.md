# authenticateAdmin

ensure user is logged in and
is an admin

# Core

## capitalize

**Parameters**

-   `value` **String** The string to capitalize

Returns **String** The capitalized string

## communityNameValidation

**Parameters**

-   `value`  The name to check

Returns **Boolean** Whether if the name is valid or not

## imageMethods

**Parameters**

-   `source_img_obj`  
-   `quality`  

### compress

Receives an Image Object (can be JPG OR PNG) and returns a new Image as compressed DataURL

**Parameters**

-   `source_img_obj` **Image** The source Image Object
-   `quality` **Integer** The output quality of Image Object
-   `output` **String** format. Possible values are jpg and png

Returns **Image** result_image_obj The compressed Image Object

### compressFromCanvas

Receives a Canvas Object and returns a new Image as compressed DataURL

**Parameters**

-   `canvas` **Canvas** The cropped canvas
-   `source_img_obj` **Image** The source Image Object
-   `quality` **Integer** The output quality of Image Object
-   `output` **String** format. Possible values are jpg and png

Returns **Image** result_image_obj The compressed Image Object

## debounce

**Parameters**

-   `fn`  
-   `delay`  

## emailValidation

**Parameters**

-   `value`  The email to check

Returns **Boolean** Whether if the email is valid or not

## getDefaultAvatar

**Parameters**

-   `type` **String** Can be 'user', 'project', 'community' or 'place'

## getDefaultCover

**Parameters**

-   `type` **String** Can be 'user', 'project', 'community' or 'place'

## isArrayValidation

**Parameters**

-   `value`  The array to check

Returns **Boolean** Whether if the array is valid or not

## isDuplicateSkillValidation

**Parameters**

-   `value` **String** The string we are looking for
-   `array` **Array** An array of skill objects

Returns **Boolean** False if the user doesn't have the skill

Returns **String** An error message if the user already have the skill

## isFilledTagsinputValidation

**Parameters**

-   `value`  The input tags to check

Returns **Boolean** Whether if the input tags is valid or not

## isFilledValidation

**Parameters**

-   `value`  The input tags to check

Returns **Boolean** Whether if the input tags is valid or not

## isStringValidation

**Parameters**

-   `value`  The variable to check

Returns **Boolean** Whether if the variable is valid or not

## isUserResourceAdmin

**Parameters**

-   `resource` **[Object]** The resource document
-   `userId` **[String]** The current user id

Returns **Boolean** 

## matchingValidation

**Parameters**

-   `value1`  One of the variable to compare
-   `value2`  One of the variable to compare

Returns **Boolean** Whether if the variables are equal or not

## nameValidation

**Parameters**

-   `value`  The name to check

Returns **Boolean** Whether if the name is valid or not

## nicHandleValidation

**Parameters**

-   `value` **String** 

## numberValidation

**Parameters**

-   `value`  The variable to check

Returns **Boolean** Whether if the variable is valid number or not

## passwordValidation

**Parameters**

-   `value`  The password to check

Returns **Boolean** Whether if the password is valid or not

## phoneValidation

**Parameters**

-   `value`  The phone number to check

Returns **Boolean** Whether if the phone number is valid or not

## randomString

**Parameters**

-   `length` **Integer** The length of the string to generate

Returns **String** result - The generated string

## s3Upload

**Parameters**

-   `resource` **[Object]** The resource document
-   `params`  
-   `callback` **[function]** Meteor.wrapAsync callback function that return the uploaded file url

## urlValidation

**Parameters**

-   `value` **String** The url to check

Returns **Boolean** Whether if the url is valid url or not

# IR_BeforeHooks

Doc: <https://github.com/iron-meteor/iron-router/blob/devel/Guide.md>

## scrollUp

# methods

# validateMessage

**Parameters**

-   `message`  
