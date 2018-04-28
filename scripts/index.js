var config = {
  BASE_URL: 'https://en.wikipedia.org/w/api.php',
  SEARCH_URL: '?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=',
  CONTENT_URL: 'https://en.wikipedia.org/?curid='
}

var Utility = (function () {
  function makeAjaxRequest (url) {
    return $.ajax({
      url: url,
      jsonp: 'callback',
      dataType: 'jsonp'
    })
  }
  return {
    ajaxRequest: makeAjaxRequest
  }
})();

(function () {
  var WikipediaApp = function (search, content) {
    this.search = search
    this.content = content
    this.init()
  }

  WikipediaApp.prototype.init = function () {
    this.attachEvent()
  }

  WikipediaApp.prototype.attachEvent = function () {
    this.search.on('click', '.fa-search', this.handleIconClick.bind(this))
    this.search.on('keypress', '.type-text', this.handleKeyPress.bind(this))
    this.search.on('click', '.close-button', this.handleCloseButton.bind(this))
  }

  WikipediaApp.prototype.handleIconClick = function () {
    this.search.find('.search').toggleClass('hide')
    this.search.find('.input-search').toggleClass('hide')
  }

  WikipediaApp.prototype.handleCloseButton = function () {
    this.search.find('.input-search').toggleClass('hide')
    this.search.find('.search').toggleClass('hide')
    this.search.find('.search-click').removeClass('hide')
    this.search.find('.type-text').val('')
    this.search.removeClass('input')
    this.content.addClass('hide')
  }

  WikipediaApp.prototype.handleKeyPress = function (event) {
    if (event.keyCode === 13) {
      this.content.removeClass('hide')
      this.search.find('.search-click').addClass('hide')
      this.search.addClass('input')
      this.getSearchResult()
    }
  }

  WikipediaApp.prototype.getSearchResult = function () {
    const inputText = this.search.find('.type-text').val()
    const URL = `${config.BASE_URL}${config.SEARCH_URL}${inputText}`
    this.content.find('.list-container').html('')
    this.makeAjaxRequest(URL)
  }

  WikipediaApp.prototype.makeAjaxRequest = function (url) {
    Utility.ajaxRequest(url)
      .done(this.handleResponse.bind(this))
      .fail(function (err) {
        console.log('Error: ' + err.status)
      })
  }

  WikipediaApp.prototype.handleResponse = function (data) {
    const data1 = data.query.pages
    let temp = []

    for (const key in data1) {
      (function (i) {
        let thumbnail = ''
        const thumb = data1[key].thumbnail
        if (thumb) {
          thumbnail = `<img src = '${thumb.source}'/>`
        }

        temp.push(`<li class='list-items'>\
			<a href="${config.CONTENT_URL}${key}" target='_blank' class='content-atag'>\
			<div class='list-wrapper'>
				<span class='image-container'>${thumbnail}</span>\
				<h1 class='list-header'>${data1[i].title}</h1>\
			</div>\
				<p class='list-content'>${data1[i].extract}</p>\
			</a>\
		</li>`)
      })(key)
    }
    this.content.find('.list-container').html(temp)
  }

  new WikipediaApp($('.search-wrapper'), $('.content-wrapper'))
})()
