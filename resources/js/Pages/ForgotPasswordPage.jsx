import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import Layout from "../Components/Layout";
import InputText from "../Components/InputText";
import Alert from "../Components/Alert";
import { schemaForgotPassword } from "../helpers/validation";
import { apiForgotPassword } from "../api";
import clsx from "clsx";

export default function ForgotPasswordPage() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
        },
        resolver: schemaForgotPassword,
    });

    const [error, setError] = useState({
        message: null,
        type: null,
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        await apiForgotPassword(data)
            .then((res) => {
                setError({ message: res.data?.message ?? "", type: "success" });
            })
            .catch((err) => {
                const message = err?.response?.data?.message ?? err?.message;
                setError({ message, type: "danger" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Layout isForGuest>
            <Alert
                message={error?.message}
                type={error?.type}
                show={error?.message !== null}
            />

            <section className="container mx-auto max-w-7xl mt-28">
                <div className="mt-8 text-center flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <h2 className="text-lg">
                        Let's get your account back again!
                    </h2>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col items-center"
                >
                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <InputText
                                label="Email"
                                type="email"
                                placeholder="eg: hello@mail.com"
                                errorMessage={errors?.email?.message ?? ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                value={field.value}
                            />
                        )}
                    />

                    <button
                        className={clsx(
                            "btn btn-primary btn-block max-w-xs",
                            loading && "btn-disabled loading"
                        )}
                        type="submit"
                    >
                        Submit
                    </button>

                    <p className="text-center">
                        <Link href="/signin">
                            <button className="btn btn-link" type="button">
                                {"<-"} Back to Sign In
                            </button>
                        </Link>
                    </p>
                </form>
            </section>
        </Layout>
    );
}
