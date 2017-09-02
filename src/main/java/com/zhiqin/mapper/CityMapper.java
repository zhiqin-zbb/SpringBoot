package com.zhiqin.mapper;

import com.zhiqin.model.City;
import com.zhiqin.common.util.MyMapper;

public interface CityMapper extends MyMapper<City> {
    City query(Integer id);
}
