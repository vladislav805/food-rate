create function `get_dish_rate_of_user` (dish_id int, user_id int) returns float begin
    declare `l_rate` float;

    if `user_id` = 0 then
        return 0;
    end if;

    select `rate` into `l_rate` from `review` where `dishId` = `dish_id` and `userId` = `user_id`;
    return ifnull(`l_rate`, 0);
end