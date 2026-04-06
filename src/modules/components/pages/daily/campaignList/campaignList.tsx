import { Campaign } from "@/types/campaign";
import classes from "./campaignList.module.scss";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { ParamsType } from "@/types/common";
import { getDailyStats } from "../../../../lib/dailyStat/dailyStat";
import { useSetAtom } from "jotai";
import { dailyStatAtom } from "../../../../lib/dailyStat/atom/atom";
import { getMonthRange } from "../../../common/globalFilter/util";
import useCampaignData from "@/hooks/useCampaignData";

interface CampaignListType {
  campaignList: Campaign[];
  params: ParamsType;
}

const CampaignList = ({ campaignList, params }: CampaignListType) => {
  const { from, to } = getMonthRange();
  /* ATOM */
  const setDailyStat = useSetAtom(dailyStatAtom);
  /* ATOM[E] */
  const [keyword, setKeyword] = useState<string>("");
  const [checked, setChecked] = useState<string[]>([]);
  const [selected, setSelected] = useState<Campaign[]>([]);
  const { getCampaignData } = useCampaignData();

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onKeyDownKeyword = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      onSearch();
    }
  };
  /**
   * 필터 검색
   */
  const onSearch = async () => {
    getCampaignData({
      ...params,
      searchParams: { ...params.searchParams, name: keyword },
    });
    sessionStorage.setItem("dailyKeyword", keyword);
  };

  const onChangeCheck = (campaign: Campaign) => {
    const id = campaign.id;
    if (checked.includes(id)) {
      const filtered = checked.filter((c) => c !== id);
      setChecked(filtered);
      sessionStorage.setItem("dailyCheck", JSON.stringify(filtered));

      const objFilter = selected.filter((s) => s.id !== id);
      setSelected(objFilter);
    } else {
      setChecked([...checked, id]);
      setSelected([...selected, campaign]);
      sessionStorage.setItem("dailyCheck", JSON.stringify([...checked, id]));
    }
  };
  useEffect(() => {
    // 검색값 유지
    const word = sessionStorage.getItem("dailyKeyword");
    if (typeof word === "string") {
      try {
        setKeyword(word);
      } catch (err) {
        console.error("parse err");
      }
    }

    // 체크값 유지
    const checked = sessionStorage.getItem("dailyCheck");
    if (typeof checked === "string") {
      try {
        const parseData = JSON.parse(checked);
        setChecked(parseData);
      } catch (err) {
        console.error("parse err");
      }
    }
  }, [params]);

  useEffect(() => {
    if (checked.length === 0) {
      return setDailyStat([]);
    }

    const startDate: string =
      typeof params.searchParams.startDate === "string"
        ? params.searchParams.startDate
        : from;
    const endDate: string =
      typeof params.searchParams.endDate === "string"
        ? params.searchParams.endDate
        : to;

    async function getDailyStatData() {
      try {
        const items = await Promise.all(
          checked.map((c) => {
            return getDailyStats({
              campaignId: c,
              startDate: startDate,
              endDate: endDate,
            });
          })
        );
        setDailyStat(items);
      } catch (err) {
        console.error("getDailyStatData");
      }
    }

    getDailyStatData();
  }, [checked, params]);

  return (
    <main className={classes.container}>
      <aside className={classes.sidebar}>
        <div className={classes.searchArea}>
          <input
            type="text"
            value={keyword}
            onChange={onChangeKeyword}
            onKeyDown={onKeyDownKeyword}
            placeholder="검색"
            className={classes.searchInput}
          />
          <button
            type="button"
            onClick={onSearch}
            className={classes.searchButton}
          >
            검색
          </button>
        </div>

        <ul className={classes.selectedList}>
          {selected.map((campaign) => (
            <li key={campaign.id} className={classes.campaignItem}>
              <label className={classes.campaignLabel}>
                <input
                  type="checkbox"
                  className={classes.checkbox}
                  onChange={() => onChangeCheck(campaign)}
                  checked={checked.includes(campaign.id)}
                  disabled={
                    !checked.includes(campaign.id) && checked.length === 3
                  }
                />
                <span className={classes.name}>{campaign.name}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className={classes.bar} />
        <ul className={classes.campaignList}>
          {campaignList.map((campaign) => (
            <li key={campaign.id} className={classes.campaignItem}>
              <label className={classes.campaignLabel}>
                <input
                  type="checkbox"
                  className={classes.checkbox}
                  onChange={() => onChangeCheck(campaign)}
                  checked={checked.includes(campaign.id)}
                  disabled={
                    !checked.includes(campaign.id) && checked.length === 3
                  }
                />
                <span className={classes.name}>{campaign.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </aside>

      <section className={classes.content} />
    </main>
  );
};

export default CampaignList;
