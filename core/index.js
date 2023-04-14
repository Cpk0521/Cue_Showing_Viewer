var hash = location.hash.replace(/^#/, '');
hash ? hash : hash = '10'

function togglePage(key) {
    const from = document.getElementById('form')
    from.innerHTML = ''

    var inner = `<div class="d-flex justify-content-center row h-50 text-center">`
    for (let index = 0; index < 4; index++) {

        inner += `
            <div class='col-lg col-sm-5 mb-2'>
                <img alt src="./Assets/sprite/${key}/AnimeChara_0${key}${(index+1).toString().padStart(2, 0)}.png" class="mb-2">
                <select class="form-select px-2" name="char${index+1}">
                <option selected value="1">六石陽菜</option>
                <option value="2">鷹取舞花</option>
                <option value="3">鹿野志穂</option>
                <option value="4">月居ほのか</option>
                <option value="5">天童悠希</option>
                <option value="6">赤川千紗</option>
                <option value="7">恵庭あいり</option>
                <option value="8">九条柚葉</option>
                <option value="9">夜峰美晴</option>
                <option value="10">神室絢</option>
                <option value="11">宮路まほろ</option>
                <option value="12">日名倉莉子</option>
                <option value="13">丸山利恵</option>
                <option value="14">宇津木聡里</option>
                <option value="15">明神凛音</option>
                <option value="16">遠見鳴</option>
                </select>
            </div>
        `
    }

    inner += `
            <div class='col d-flex flex-column justify-content-center'>
                <input name='key' class="d-none" value="${key}">
                <button type='submit' class='btn mx-auto' form="form" value="Submit"><img alt src="./Assets/sprite/ShowingStartButton.png" style="height: min-content;"></button>
            </div>
        </div>
    `

    from.innerHTML = inner
}

togglePage(hash)
