document.addEventListener('DOMContentLoaded', () => {
  const options = document.querySelectorAll('.option');
  const texts = document.querySelectorAll('.text');

  options.forEach(option => option.classList.remove('is--active'));
  texts.forEach(text => text.classList.remove('is--visible'));

  const defaultOption = document.querySelector('.option.anyone');
  const defaultText = document.querySelector('.text.anyone');

  defaultOption.classList.add('is--active');
  defaultText.classList.add('is--visible');

  options.forEach(option => {
      option.addEventListener('click', () => {
          options.forEach(opt => opt.classList.remove('is--active'));
          texts.forEach(text => text.classList.remove('is--visible'));

          option.classList.add('is--active');
          document.querySelector(`.text.${option.classList[1]}`).classList.add('is--visible');
      });
  });
});
