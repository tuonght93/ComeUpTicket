import { AsyncStorage } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
callApi = async (endpoint, method = 'GET', body, header = '') => {
    return axios({
        method: method,
        url: `http://comeup.techup.vn/api/${endpoint}`,
        data: body,
        headers: header
    }).catch(error => {
        console.log(error)
        if (error.response) {
            Toast.showWithGravity(error.response.status+' Connect errors', Toast.LONG, Toast.TOP)
        }
    });
}

callApiWithHeader = async (endpoint, method = 'GET', body) => {
    // console.log(`http://comeup.techup.vn/api/${endpoint}`)
    const auKey = await AsyncStorage.getItem('auKey');
    const auValue = await AsyncStorage.getItem('auValue');
    let header = {
        [auKey]: auValue
    }
    if (!auKey || !auValue) {
        var res = {
                data: {
                    status: 401,
                    message: 'Authentication required'
                },
                status: 401,
        }
        return res;
    } else {
        return axios({
            method: method,
            url: `http://comeup.techup.vn/api/${endpoint}`,
            data: body,
            headers: header
        }).catch(error => {
            if (error.response && error.response.status == 401) {
                var res = {
                        data: {
                            status: 401,
                            message: 'Authentication required'
                        },
                        status: 401,
                }
                return res;
            } else if (error.response) {
                Toast.showWithGravity(error.response.status+' Connect errors', Toast.LONG, Toast.TOP)
            }
        });
    }
};


module.exports = {
  callApi,
  callApiWithHeader
};
