(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []
  const displayMode = document.getElementById('display-mode')

  getTotalPages(data)
  getPageData(1, data)

  // displayDataList(data)

  // function displayDataList(data) {
  //   let htmlContent = ''
  //   data.forEach(function (item, index) {
  //     htmlContent += `
  //       <div class="col-sm-3">
  //         <div class="card mb-2">
  //           <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
  //           <div class="card-body movie-item-body">
  //             <h6 class="card-title">${item.title}</h5>
  //           </div>
  //           <div class="card-footer">
  //             <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
  //             <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
  //           </div>
  //         </div>
  //       </div>
  //     `
  //   })
  //   dataPanel.innerHTML = htmlContent
  // }

  function displayDataList(data) {
    let htmlContent = ''
    // display by list mode
    if (dataPanel.classList.contains('list-mode')) {
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
            <!-- favorite  remove button -->
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>  
          </div> 
        </div>
      `
      })
    }
    // display by card mode
    else if (dataPanel.classList.contains('card-mode')) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class ="col-sm-3">
          <div class = "card mb-2">
            <img src="${POSTER_URL}${item.image}" class="card-img-top" alt= "Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <!-- favorite  remove button -->
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>  
          </div> 
        </div>
      `
      })
    }
    dataPanel.innerHTML = htmlContent
  }

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

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    }
    else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  function removeFavoriteItem(id) {
    // find movie by id
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    // removie movie and update localStorage
    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    // repaint dataList
    displayDataList(data)
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

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
      localStorage.setItem('page', JSON.stringify(event.target.dataset.page))
    }
  })

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    console.log(paginationData)
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }


  // listen to display-mode click event
  displayMode.addEventListener('click', event => {
    console.log(event.target)
    if (event.target.classList.contains("fa-bars")) {
      dataPanel.classList.remove("card-mode")
      dataPanel.classList.add("list-mode")
      console.log(dataPanel.classList)
      const page = JSON.parse(localStorage.getItem('page')) || 1
      getPageData(page)
    }
    else if (event.target.classList.contains("fa-th")) {
      dataPanel.classList.remove("list-mode")
      dataPanel.classList.add("card-mode")
      console.log(dataPanel.classList)
      const page = JSON.parse(localStorage.getItem('page')) || 1
      getPageData(page)
    }
  })

})()
