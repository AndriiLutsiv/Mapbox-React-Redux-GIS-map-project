import { ConfigProvider, InputNumber, Slider } from "antd"
import React, { useState } from "react";
import styles from './RetoolCharts.module.scss';
import classNames from "classnames";

interface Props {
    setAverageVoucherValue: (value: number) => void;
    setAverageOPPPPerAnnum: (value: number) => void;
    setRevenuePeriod: (value: number) => void;
    setCPPCAssetValue: (value: number) => void;
    setCPPPAssetValue1: (value: number) => void;
    setBorrowingCouponRate: (value: number) => void;
    averageVoucherValue: number;
    averageOPPPPerAnnum: number;
    revenuePeriod: number;
    CPPPAssetValue1: number;
    CPPCAssetValue: number;
    borrowingCouponRate: number;
}

export const Variables: React.FC<Props> = ({ setAverageVoucherValue,
    setAverageOPPPPerAnnum,
    setRevenuePeriod,
    setCPPCAssetValue,
    setCPPPAssetValue1,
    setBorrowingCouponRate,
    averageVoucherValue,
    averageOPPPPerAnnum,
    revenuePeriod,
    CPPPAssetValue1,
    CPPCAssetValue,
    borrowingCouponRate, }) => {

    return <>
        <ConfigProvider
            theme={{
                components: {
                    Slider: {
                        trackBg: '#EA347E',
                        railBg: '#292929',
                        railHoverBg: '#292929',
                        trackHoverBg: '#EA347E',
                        handleActiveColor: '#EA347E',
                        handleColor: '#EA347E'
                    },
                    InputNumber: {
                        controlWidth: 500
                    }
                }
                ,
                token: {
                    colorPrimaryHover: '#EA347E',
                    //     borderRadius: 2,
                    colorBgContainer: '#fff',
                },
            }}
        >
            <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                <p className={styles.sliderBlockTitle}>Average Voucher Value</p>
                <div className={styles.inputWrapper}>
                    <InputNumber
                        formatter={(value) => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        defaultValue={averageVoucherValue}
                        step={0.01}
                        min={0}
                        onChange={(value: number | null) => setAverageVoucherValue(value ? value : 0)} />
                </div>

            </div>
            <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                <p className={styles.sliderBlockTitle}>Average OPPP Per Annum</p>
                <div className={styles.inputWrapper}>
                    <InputNumber
                        defaultValue={averageOPPPPerAnnum}
                        step={0.01}
                        formatter={(value) => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        onChange={(value: number | null) => value && setAverageOPPPPerAnnum(value)}
                    />
                </div>

            </div>
            <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                <p className={styles.sliderBlockTitle}>Revenue Period</p>
                <div className={styles.sliderContainer}>
                    <Slider
                        defaultValue={revenuePeriod}
                        max={10}
                        onChange={value => setRevenuePeriod(value)} />
                    <p className={styles.sliderData}>{revenuePeriod} / 10</p>
                </div>
            </div>
            <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                <p className={styles.sliderBlockTitle}>CPPP Asset Value</p>
                <div className={styles.inputWrapper}>
                    <InputNumber
                        defaultValue={CPPPAssetValue1}
                        step={1}
                        formatter={(value) => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        onChange={(value: number | null) => value && setCPPPAssetValue1(value)}
                    />
                </div>

            </div>

            <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                <p className={styles.sliderBlockTitle}>CPPC Asset Value</p>
                <div className={styles.inputWrapper}>
                    <InputNumber
                        defaultValue={CPPCAssetValue}
                        step={1}
                        formatter={(value) => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        onChange={(value: number | null) => value && setCPPCAssetValue(value)}
                    />
                </div>

            </div>
            <div className={classNames(styles.sliderBlock, styles.variableBlock)}>
                <p className={styles.sliderBlockTitle}>Borrowing Coupon Rate</p>
                <div className={styles.inputWrapper}>
                    <InputNumber
                        defaultValue={borrowingCouponRate * 100}
                        step={1}
                        max={100}
                        min={0}
                        onChange={(value: number | null) => value && setBorrowingCouponRate(value)}
                        formatter={value => `${value}%`}
                    />
                </div>

            </div>
        </ConfigProvider>
    </>
}