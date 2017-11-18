package com.zhiqin.service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.zhiqin.common.util.MD5Utils;
import com.zhiqin.mapper.UserInfoMapper;
import com.zhiqin.model.UserInfo;

@Service
public class UserInfoService {
    @Autowired
    private UserInfoMapper userInfoMapper;

    public List<UserInfo> getAll(UserInfo UserInfo) {
        if (UserInfo.getPage() != null && UserInfo.getRows() != null) {
            PageHelper.startPage(UserInfo.getPage(), UserInfo.getRows());
        }
        return userInfoMapper.selectAll();
    }

    public UserInfo getById(Integer id) {
        return userInfoMapper.selectByPrimaryKey(id);
    }

    public void deleteById(Integer id) {
        userInfoMapper.deleteByPrimaryKey(id);
    }

    public void save(UserInfo user) {
        String encodedPassword = MD5Utils.sign(user.getPassword());
        user.setPassword(encodedPassword);

        if (user.getId() != null) {
            userInfoMapper.updateByPrimaryKey(user);
        } else {
            userInfoMapper.insert(user);
        }
    }

    public Boolean validate(UserInfo userInfo) {
        UserInfo user = new UserInfo();
        user.setUsername(userInfo.getUsername());
        UserInfo userInDb = userInfoMapper.selectOne(user);

        return MD5Utils.verify(userInfo.getPassword(), userInDb.getPassword());
    }

    private String creatMD5(String password) {
        // 生成一个MD5加密计算摘要
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("MD5");
            md.update(password.getBytes());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return new BigInteger(1, md.digest()).toString(16);
    }
}
