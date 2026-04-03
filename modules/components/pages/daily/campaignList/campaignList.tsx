import { Campaign } from "@/types/marketing";
import styles from "./campaignList.module.scss";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { ParamsType } from "@/types/common";
import { useRouter } from "next/navigation";
import { getDailyStats } from "../../../../lib/dailyStat/dailyStat";
import { useSetAtom } from "jotai";
import { dailyStatAtom } from "../../../../atom/dailyStat/atom";

interface CampaignListType {
  campaignList: Campaign[];
  params: ParamsType;
}

const CampaignList = ({ campaignList, params }: CampaignListType) => {
  const router = useRouter();
  /* ATOM */
  const setDailyStat = useSetAtom(dailyStatAtom);
  /* ATOM[E] */
  const [keyword, setKeyword] = useState<string>("");
  const [checked, setChecked] = useState<string[]>([]);

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onKeyDownKeyword = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      onSearch();
    }
  };

  const onSearch = async () => {
    const queryString = new URLSearchParams({
      ...params?.searchParams,
      name: keyword,
    });
    router.push(`/dashboard/daily?${queryString.toString()}`);
    if (keyword === params?.searchParams?.name) {
      router.refresh();
      return;
    }
  };

  const onChangeCheck = (id: string) => {
    if (checked.includes(id)) {
      const filtered = checked.filter((c) => c !== id);
      setChecked(filtered);
    } else {
      setChecked([...checked, id]);
    }
  };

  useEffect(() => {
    if (
      params.searchParams.name &&
      typeof params.searchParams.name === "string"
    ) {
      setKeyword(params.searchParams.name);
    }

    if (
      params.searchParams.checked &&
      typeof params.searchParams.checked === "string"
    ) {
      try {
        const ids = JSON.parse(params.searchParams.checked);
        setChecked(ids);
      } catch (err) {
        console.error("parse err");
      }
    }
  }, [params]);

  useEffect(() => {
    if (checked.length === 0) {
      return setDailyStat([]);
    }

    async function getDailyStatData() {
      try {
        const items = await Promise.all(
          checked.map((c) => {
            return getDailyStats({
              campaignId: c,
              startDate: "2026-02-01",
              endDate: "2026-04-30",
            });
          })
        );
        setDailyStat(items);

        const queryString = new URLSearchParams({
          ...params?.searchParams,
          checked: JSON.stringify(checked),
        });
        router.push(`/dashboard/daily?${queryString.toString()}`);
      } catch (err) {
        console.error("getDailyStatData");
      }
    }

    getDailyStatData();
  }, [checked]);

  return (
    <main className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.searchArea}>
          <input
            type="text"
            value={keyword}
            onChange={onChangeKeyword}
            onKeyDown={onKeyDownKeyword}
            placeholder="검색"
            className={styles.searchInput}
          />
          <button
            type="button"
            onClick={onSearch}
            className={styles.searchButton}
          >
            검색
          </button>
        </div>
        <ul className={styles.campaignList}>
          {campaignList.map((campaign) => (
            <li key={campaign.id} className={styles.campaignItem}>
              <label className={styles.campaignLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  onChange={() => onChangeCheck(campaign.id)}
                  checked={checked.includes(campaign.id)}
                  disabled={
                    !checked.includes(campaign.id) && checked.length === 3
                  }
                />
                <span className={styles.name}>{campaign.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </aside>

      <section className={styles.content} />
    </main>
  );
};

export default CampaignList;
