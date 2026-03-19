angular.module('Writter')
.service('CacheService', [function(){

    this.setData = function({data, cache_name}){
        const hasUpdate = typeof (data?.metadata?.update_frequency) === "number";
        const update_frequency = hasUpdate ? data.metadata.update_frequency:null;

        const cache = {
            expires: hasUpdate,
            expires_at: hasUpdate ? Date.now() + (update_frequency *60 * 1000) : null, //+ In minutes 
            data: data,
        }

        localStorage.setItem(cache_name, JSON.stringify(cache));
        return true
    }

    this.getData = function(cache_name, {refuse_cache=false}){
        try{
            const raw_cache = JSON.parse(localStorage.getItem(cache_name));
            if (!raw_cache) return null;

            if ((raw_cache.expires && Date.now() > raw_cache.expires_at) || refuse_cache){
                return null;
            }
            return raw_cache.data;
        }
        catch (error){
            throw error;
        }
    }

}]);