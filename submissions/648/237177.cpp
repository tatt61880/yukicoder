//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
typedef long long ll;
const int MOD = 1e9+7;
//}}}

ll f(ll n){
	return n * (n + 1) / 2;
}
int main(){
	ll n;
	cin >> n;

	ll hi = 1LL << 31;
	ll lo = 0;
	while(hi - lo > 1){
		ll md = lo + (hi - lo) / 2;
		if(f(md) > n){
			hi = md;
		}else{
			lo = md;
		}
	}
	if(f(lo) == n){
		printf("YES\n%lld\n", lo);
	}else{
		puts("NO");
	}
	return 0;
}
