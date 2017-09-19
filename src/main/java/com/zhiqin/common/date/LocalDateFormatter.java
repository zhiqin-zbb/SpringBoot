package com.zhiqin.common.date;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.format.Formatter;

/**
 * Created by zhangbinbin on 2017/9/18.
 */
public class LocalDateFormatter implements Formatter<LocalDate> {
    public static final String CN_PATTERN = "yyyy-MM-dd";

    public static final String US_PATTERN = "MM/dd/yyyy";

    public static final String NORMAL_PATTERN = "dd/MM/yyyy";

    @Override
    public LocalDate parse(String text, Locale locale) throws ParseException {
        return LocalDate.parse(text, DateTimeFormatter.ofPattern(getPattern(locale)));
    }

    @Override
    public String print(LocalDate object, Locale locale) {
        return DateTimeFormatter.ofPattern(getPattern(locale)).format(object);
    }

    public static String getPattern(Locale locale) {
        if (Locale.CHINA.getCountry().equals(locale.getCountry())) {
            return CN_PATTERN;
        } else if (Locale.US.getCountry().equals(locale.getCountry())) {
            return US_PATTERN;
        } else {
            return NORMAL_PATTERN;
        }
    }
}
