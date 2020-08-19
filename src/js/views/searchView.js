import { elements } from './base';

export const getInput = () => elements.searchInput.value; //return whatever input in search field 

export const clearInput = () => { //検索文字消す
  elements.searchInput.value = '';
};

export const clearResults = () => { //検索結果を消す
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {

  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

// e.g. 'Pasta with tomato and spinach.'
// acc:0 / acc + cur.length = 5 / newTitle = ['Pasta']
// acc:5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
// acc:9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
// acc:15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
// acc:18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = []; //arrayの中に入れてく
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {//蓄積+今のlengthがまだ17以下なら
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    // return the result
    return `${newTitle.join('')} ...`;
  } 
  return title;
} 

const renderRecipe = recipe => {
  const markup = `
  <li>
  <a class="results__link" href="#${recipe.recipe_id}">
      <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
      </div>
  </a>
</li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type 'prev' or 'next'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page +1}>
  <span>Page ${type === 'prev' ? page -1 : page +1}</span>
    <svg  class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>

`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage); //切り上げ
  let button;
  if(page === 1 && pages > 1) {
    // Only button to got to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage; // 2ページ目: 2-1 * 10 = 10
  const end = page * resPerPage; // 2ページ目: 2 * 10 = 20

  recipes.slice(start, end).forEach(renderRecipe); // loop all 30 results and call renderRecipe for each of them

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
