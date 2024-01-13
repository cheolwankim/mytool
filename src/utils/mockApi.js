class MockApi {
    #db = {};

    constructor() {
        if ([undefined, null].includes(window.db)) {
            window.db = require("./db.json")
        }
        this.#db = window.db;
    }

    /**
     * 삭제 api
     * @param mailUidList mailUidList [Type] Number || Array
     * @return data {
     * data: data: [Type] BoardDtoList,
     * status [Type] Number
     * }
     * */
    async delete({mailUidList = [] || 0}) {
        const result = {
            data: null,
            status: null,
        }
        await this.#sleepWithRandom();
        try {
            const tempArray = Array.isArray(mailUidList) ? mailUidList : [mailUidList];
            const tempData = this.#db.articles.filter(v => !tempArray.includes(v.mailUid));
            if (tempData.length === this.#db.articles.length) {
                result.status = 500;
                throw new Error(`Cannot read property mailUid ${tempArray.join(', ')} of undefined`);
            }
            this.#db.articles = tempData;
            this.#setResultSuccess(result);
            result.status = 200;
        } catch (error) {
            console.error(error);
            this.#setResultFail(result);
            return result;
        }


        return result
    }

    /**
     * 업데이트 api
     * @param mailUid mailUid [Type] Number
     * @param mailType 'Updated Type' [Type] String
     * @param mailTitle 'Updated Title' [Type] String
     * @param ismailIUse 'Y' || 'N' [Type] String
     * @param mailContent 'Updated Content' [Type] String
     * @param reason 'Updated Reason' [Type] String
     * @return data {
     * data: [Type] BoardDtoList,
     * status [Type] Number
     * }
     * */
    async put({
                  mailUid,
                  mailType,
                  mailTitle,
                  ismailIUse,
                  mailContent,
                  reason,
              }) {
        const result = {
            data: null,
            status: null,
        }

        await this.#sleepWithRandom();
        try {
            if (isNaN(mailUid)) {
                result.status = 500;
                throw new Error(`Invalid input mailUid: ${mailUid} not a number.`);
            }
            let dtoIndex = this.#db.articles.findIndex(v => v.mailUid === mailUid);
            if (dtoIndex < 0) {
                result.status = 500;
                throw new Error(`Cannot read property mailUid ${mailUid} of undefined`);
            }

            const tempDto = {
                mailUid: mailUid,
                mailType: mailType || this.#db.articles[dtoIndex].mailType,
                mailTitle: mailTitle || this.#db.articles[dtoIndex].mailTitle,
                ismailIUse: ismailIUse || this.#db.articles[dtoIndex].ismailIUse,
                mailContent: mailContent || this.#db.articles[dtoIndex].mailContent,
                modificationDate: this.#getLocalDate,
                reason: reason
            }


            this.#db.articles.splice(dtoIndex, 1, tempDto);

            this.#setResultSuccess(result);
        } catch (error) {
            console.error(error);
            this.#setResultFail(result);
            return result;
        }

        return result
    }

    /**
     * 검색 api
     * @param mailType 'Search Type' [Type] String
     * @param mailTitle 'Search Title' [Type] String
     * @param ismailIUse 'Y' || 'N' [Type] String
     * @param limit 'value limit' [Type] Number
     * @param currentPage 'currentPage' [Type] Number
     * @return data {
     * data: {
     *     articles:[Type] BoardDtoList,
     *     page:[Type] PageDtoList,
     * },
     * status [Type] Number
     * }
     * */

    async get({
                  mailType,
                  mailTitle,
                  ismailIUse,
                  limit,
                  currentPage,
              } = {} || undefined) {
        const result = {
            data: null,
            status: null,
        }
        await this.#sleepWithRandom();

        const tempMailDto = {
            mailType: mailType || "",
            mailTitle: mailTitle || "",
            ismailIUse: ismailIUse || "",
        }

        const tempPageDto = {
            limit: limit || this.#db.articles.length,
            currentPage: currentPage || 1,
        }

        try {
            const tempDB = this.#db.articles.filter(value => this.#checkObjectValue(tempMailDto, value));

            const tempResult = {
                articles : tempDB,
                page: tempPageDto
            }
            this.#setResultSuccess(result, tempResult);
            return result;
        } catch (error) {
            console.error(error);
            this.#setResultFail(result);
            return result;
        }
    }

    /**
     * 생성 api
     * @param mailType 'Inserted Type' [Type] String
     * @param mailTitle 'Inserted Title' [Type] String
     * @param ismailIUse 'Y' || 'N' [Type] String
     * @param mailContent 'Inserted Content' [Type] String
     * @param reason 'Inserted Reason' [Type] String
     * @return data {
     * data: [Type] BoardDtoList,
     * status [Type] Number
     * }
     * */
    async post({
                   mailType,
                   mailTitle,
                   ismailIUse,
                   mailContent,
                   reason,
               }) {
        const result = {
            data: null,
            status: null,
        }
        await this.#sleepWithRandom();

        const tempDto = {
            mailUid: this.#db.articles.length + 1,
            mailType: mailType,
            mailTitle: mailTitle,
            ismailIUse: ismailIUse,
            mailContent: mailContent,
            modificationDate: this.#getLocalDate,
            reason: reason,
        }

        try {
            this.#db.articles.push(tempDto);
            this.#setResultSuccess(result);
        } catch (error) {
            console.error(error)
            this.#setResultFail(result);
            return result;
        }

        return result
    }

    #setResultSuccess(result, articles) {
        result.data = articles || Object.assign([], this.#db.articles);
        result.status = 200;
    }

    #setResultFail(result) {
        if (!result.status) {
            result.status = 400;
        }
    }

    #getLocalDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        return `${year}-${month < 10 ? "0" + month : month}-${day}T${hours}:${minutes}:${seconds}Z`;
    }

    #checkObjectValue(object, compereValue) {
        const keys = Object.keys(object);
        let checkData = true;
        keys.forEach(key => {
            if (!compereValue[key].includes(object[key])) {
                checkData = false;
            }
        })
        return checkData;
    }

    #sleep(duration = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
    async #sleepWithRandom(fromMs = 0, toMs = 1000){
        const randomMilliseconds = Math.max(Math.random() * toMs + fromMs, 1);
        return await this.#sleep(randomMilliseconds);
    }

}

export default MockApi
