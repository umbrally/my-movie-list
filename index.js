(function () {
  // write your code here
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []
  const displayMode = document.getElementById('display-mode')
  let page = localStorage.setItem('page', JSON.stringify(1))


  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    console.log(data)
    // displayDataList(data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))


  function displayDataList(data) {
    let htmlContent = ''
    // display by card mode
    if (dataPanel.classList.contains('card-mode')) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class ="col-sm-3">
          <div class = "card mb-2">
            <img src="${POSTER_URL}${item.image}" class="card-img-top" alt= "Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>  
          </div> 
        </div>
      `
      })
    }

    // display by list mode
    else if (dataPanel.classList.contains('list-mode')) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class ="col-sm-12">
          <div class = "p-2 row border-top">
            <img src="${POSTER_URL}${item.image}" class="card-img-top d-none" alt= "Card image cap">
            <div class="col-sm-9">
              <h6>${item.title}</h6>
            </div>
            <!-- "More" button -->
            <div class="col-sm-3">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>  
          </div> 
        </div>
      `
      })
    }
    dataPanel.innerHTML = htmlContent
  }

  // Show modal
  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    console.log(paginationData)
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()
    console.log(searchInput.value)
    const regex = new RegExp(searchInput.value, 'i')
    // results = data.filter(movie => regex.test(movie.title))
    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)

  })


  // listen to more or favorite click event
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    }
    else if (event.target.matches('.btn-add-favorite')) {
      console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
      // Storage page in localStorage
      localStorage.setItem('page', JSON.stringify(event.target.dataset.page))
    }
  })

  // listen to display-mode click event
  displayMode.addEventListener('click', event => {
    console.log(event.target)
    if (event.target.classList.contains("fa-bars")) {
      dataPanel.classList.remove("card-mode")
      dataPanel.classList.add("list-mode")
      // get page in the localStorage
      page = JSON.parse(localStorage.getItem('page'))
      getPageData(page)
    }
    else if (event.target.classList.contains("fa-th")) {
      dataPanel.classList.remove("list-mode")
      dataPanel.classList.add("card-mode")
      // get page in the localStorage
      page = JSON.parse(localStorage.getItem('page'))
      getPageData(page)
    }
  })

})()

