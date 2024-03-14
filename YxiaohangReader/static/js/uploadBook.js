/**
const inputAuthor = document.getElementById('author');
const inputIntroduce = document.getElementById('introduce');
const inputClassfiyName = document.getElementById('classfiyName');
const sureUploadButton = document.getElementById('sureUpload');

sureUploadButton.addEventListener('click', function(event) {
  const authorMaxLength = parseInt(inputAuthor.getAttribute('maxlength'));
  const introduceMaxLength = parseInt(inputAuthor.getAttribute('maxlength'));
  const classfiyNameMaxLength = parseInt(inputAuthor.getAttribute('maxlength'));
  if (inputAuthor.value.length > maxLength) {
    const result = confirm("警告: 输入作者名必须少于10个字!\n如果您坚持输入, 系统将截断超出10个字的部分!");
    if (result == true) {
        inputAuthor.value = inputAuthor.value.slice(0, authorMaxLength);
        return true;
    } else {
        event.preventDefault();
        return false;
    }
  }
  else if (inputIntroduce.value.length > maxLength) {
    const result = confirm("警告: 输入简介字数必须少于100个字!\n如果您坚持输入, 系统将截断超出100个字的部分!");
    if (result == true) {
        inputIntroduce.value = inputAuthor.value.slice(0, introduceMaxLength);
        return true;
    } else {
        event.preventDefault();
        return false;
    }
  }
  else if (inputClassfiyName.value.length > maxLength) {
    const result = confirm("警告: 输入分类名必须少于10个字!\n如果您坚持输入, 系统将截断超出10个字的部分!");
    if (result == true) {
        inputClassfiyName.value = inputAuthor.value.slice(0, classfiyNameMaxLength);
        return true;
    } else {
        event.preventDefault();
        return false;
    }
  }
});
*/
